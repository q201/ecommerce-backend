import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Return, ReturnStatus, ReturnType } from './entities/return.entity';
import { ReturnItem, ItemCondition } from './entities/return-item.entity';
import { Refund, RefundStatus, RefundMethod, RefundType } from './entities/refund.entity';
import { ReturnReason, ReasonCategory } from './entities/return-reason.entity';
import { CreateReturnDto, ReturnItemDto } from './dtos/create-return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    @InjectRepository(Return)
    private returnRepository: Repository<Return>,
    @InjectRepository(ReturnItem)
    private returnItemRepository: Repository<ReturnItem>,
    @InjectRepository(Refund)
    private refundRepository: Repository<Refund>,
    @InjectRepository(ReturnReason)
    private returnReasonRepository: Repository<ReturnReason>,
  ) {}

  async createReturn(createReturnDto: CreateReturnDto): Promise<Return> {
    // Validate order and items
    await this.validateReturnRequest(createReturnDto);

    // Generate return number
    const returnNumber = await this.generateReturnNumber();

    // Calculate amounts
    const { totalAmount, refundAmount, restockingFee } = await this.calculateReturnAmounts(createReturnDto.items);

    // Create return record
    const returnRequest = this.returnRepository.create({
      ...createReturnDto,
      returnNumber,
      totalAmount,
      refundAmount,
      restockingFee,
      isPartialReturn: createReturnDto.items.length > 1,
      status: ReturnStatus.PENDING,
    });

    const savedReturn = await this.returnRepository.save(returnRequest);

    // Create return items
    const returnItems = createReturnDto.items.map(item => 
      this.returnItemRepository.create({
        ...item,
        returnId: savedReturn.id,
        originalPrice: 0, // This would be fetched from order
        refundAmount: 0, // This would be calculated
      })
    );

    await this.returnItemRepository.save(returnItems);

    return await this.getReturnById(savedReturn.id);
  }

  async getReturnById(id: string): Promise<Return> {
    const returnRequest = await this.returnRepository.findOne({
      where: { id },
      relations: ['items', 'refunds'],
    });

    if (!returnRequest) {
      throw new NotFoundException(`Return with ID ${id} not found`);
    }

    return returnRequest;
  }

  async getReturnByNumber(returnNumber: string): Promise<Return> {
    const returnRequest = await this.returnRepository.findOne({
      where: { returnNumber },
      relations: ['items', 'refunds'],
    });

    if (!returnRequest) {
      throw new NotFoundException(`Return with number ${returnNumber} not found`);
    }

    return returnRequest;
  }

  async getCustomerReturns(customerId: string): Promise<Return[]> {
    return await this.returnRepository.find({
      where: { customerId },
      relations: ['items'],
      order: { createdAt: 'DESC' },
    });
  }

  async getOrderReturns(orderId: string): Promise<Return[]> {
    return await this.returnRepository.find({
      where: { orderId },
      relations: ['items', 'refunds'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateReturnStatus(id: string, status: ReturnStatus, adminNotes?: string): Promise<Return> {
    const returnRequest = await this.getReturnById(id);

    returnRequest.status = status;
    if (adminNotes) {
      returnRequest.adminNotes = adminNotes;
    }

    // Handle status-specific logic
    if (status === ReturnStatus.APPROVED) {
      await this.handleReturnApproval(returnRequest);
    } else if (status === ReturnStatus.RECEIVED) {
      await this.handleReturnReceived(returnRequest);
    } else if (status === ReturnStatus.PROCESSED) {
      await this.handleReturnProcessed(returnRequest);
    }

    return await this.returnRepository.save(returnRequest);
  }

  async createRefund(returnId: string, refundData: Partial<Refund>): Promise<Refund> {
    const returnRequest = await this.getReturnById(returnId);

    if (returnRequest.status !== ReturnStatus.PROCESSED) {
      throw new BadRequestException('Return must be processed before creating refund');
    }

    const refundNumber = await this.generateRefundNumber();

    const refund = this.refundRepository.create({
      ...refundData,
      returnId,
      refundNumber,
      status: RefundStatus.PENDING,
    });

    return await this.refundRepository.save(refund);
  }

  async processRefund(refundId: string): Promise<Refund> {
    const refund = await this.refundRepository.findOne({
      where: { id: refundId },
      relations: ['return'],
    });

    if (!refund) {
      throw new NotFoundException(`Refund with ID ${refundId} not found`);
    }

    try {
      // Process refund based on method
      await this.processRefundByMethod(refund);

      refund.status = RefundStatus.COMPLETED;
      refund.completedAt = new Date();
      refund.processedAt = new Date();

      return await this.refundRepository.save(refund);
    } catch (error) {
      refund.status = RefundStatus.FAILED;
      refund.failureReason = error.message;
      await this.refundRepository.save(refund);
      throw error;
    }
  }

  async getReturnReasons(): Promise<ReturnReason[]> {
    return await this.returnReasonRepository.find({
      where: { isActive: true },
      order: { priority: 'ASC', name: 'ASC' },
    });
  }

  async createReturnReason(reasonData: Partial<ReturnReason>): Promise<ReturnReason> {
    const reason = this.returnReasonRepository.create(reasonData);
    return await this.returnReasonRepository.save(reason);
  }

  async updateReturnReason(id: string, updateData: Partial<ReturnReason>): Promise<ReturnReason> {
    const reason = await this.returnReasonRepository.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException(`Return reason with ID ${id} not found`);
    }

    Object.assign(reason, updateData);
    return await this.returnReasonRepository.save(reason);
  }

  async deleteReturnReason(id: string): Promise<void> {
    const reason = await this.returnReasonRepository.findOne({ where: { id } });
    if (!reason) {
      throw new NotFoundException(`Return reason with ID ${id} not found`);
    }

    await this.returnReasonRepository.remove(reason);
  }

  async getReturnsAnalytics(): Promise<any> {
    const [totalReturns, pendingReturns, completedReturns] = await Promise.all([
      this.returnRepository.count(),
      this.returnRepository.count({ where: { status: ReturnStatus.PENDING } }),
      this.returnRepository.count({ where: { status: ReturnStatus.COMPLETED } }),
    ]);

    const totalRefundAmount = await this.refundRepository
      .createQueryBuilder('refund')
      .select('SUM(refund.amount)', 'total')
      .where('refund.status = :status', { status: RefundStatus.COMPLETED })
      .getRawOne();

    const returnReasons = await this.returnRepository
      .createQueryBuilder('return')
      .select('return.reason', 'reason')
      .addSelect('COUNT(*)', 'count')
      .groupBy('return.reason')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      totalReturns,
      pendingReturns,
      completedReturns,
      totalRefundAmount: parseFloat(totalRefundAmount.total) || 0,
      topReturnReasons: returnReasons,
      averageProcessingTime: await this.calculateAverageProcessingTime(),
    };
  }

  async generateReturnLabel(returnId: string): Promise<{ label: string; trackingNumber: string }> {
    const returnRequest = await this.getReturnById(returnId);

    if (returnRequest.status !== ReturnStatus.APPROVED) {
      throw new BadRequestException('Return must be approved to generate shipping label');
    }

    // This would integrate with shipping provider API
    const label = `RETURN_LABEL_${returnRequest.returnNumber}`;
    const trackingNumber = `TRK_${returnRequest.returnNumber}`;

    returnRequest.shippingLabel = label;
    returnRequest.trackingNumber = trackingNumber;
    await this.returnRepository.save(returnRequest);

    return { label, trackingNumber };
  }

  private async validateReturnRequest(createReturnDto: CreateReturnDto): Promise<void> {
    // Validate order exists and belongs to customer
    // Validate items belong to order
    // Validate return window
    // Validate item eligibility
    // This would integrate with order service
  }

  private async generateReturnNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `RET${timestamp}${random}`;
  }

  private async generateRefundNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `REF${timestamp}${random}`;
  }

  private async calculateReturnAmounts(items: ReturnItemDto[]): Promise<{
    totalAmount: number;
    refundAmount: number;
    restockingFee: number;
  }> {
    let totalAmount = 0;
    let refundAmount = 0;
    let restockingFee = 0;

    for (const item of items) {
      // This would fetch actual prices from order
      const itemPrice = 0; // Placeholder
      const itemTotal = itemPrice * item.quantity;
      
      totalAmount += itemTotal;
      
      // Calculate refund amount based on condition
      const refundPercentage = this.getRefundPercentageByCondition(item.condition);
      const itemRefund = itemTotal * (refundPercentage / 100);
      refundAmount += itemRefund;
      
      // Calculate restocking fee
      const restockingFeePercentage = 10; // This would come from return reason
      const itemRestockingFee = itemTotal * (restockingFeePercentage / 100);
      restockingFee += itemRestockingFee;
    }

    return { totalAmount, refundAmount, restockingFee };
  }

  private getRefundPercentageByCondition(condition: ItemCondition): number {
    switch (condition) {
      case ItemCondition.NEW:
        return 100;
      case ItemCondition.LIKE_NEW:
        return 95;
      case ItemCondition.GOOD:
        return 85;
      case ItemCondition.FAIR:
        return 70;
      case ItemCondition.POOR:
        return 50;
      case ItemCondition.DAMAGED:
        return 0;
      default:
        return 0;
    }
  }

  private async handleReturnApproval(returnRequest: Return): Promise<void> {
    // Generate shipping label if needed
    if (returnRequest.requiresShipping) {
      await this.generateReturnLabel(returnRequest.id);
    }

    // Send notification to customer
    // Update inventory if needed
  }

  private async handleReturnReceived(returnRequest: Return): Promise<void> {
    returnRequest.actualReturnDate = new Date();
    
    // Update inventory
    // Inspect items
    // Calculate final refund amounts
  }

  private async handleReturnProcessed(returnRequest: Return): Promise<void> {
    // Create automatic refund if applicable
    if (returnRequest.type === ReturnType.REFUND) {
      await this.createRefund(returnRequest.id, {
        amount: returnRequest.refundAmount,
        method: RefundMethod.ORIGINAL_PAYMENT,
        type: RefundType.FULL,
        isAutomatic: true,
      });
    }
  }

  private async processRefundByMethod(refund: Refund): Promise<void> {
    switch (refund.method) {
      case RefundMethod.ORIGINAL_PAYMENT:
        // Process through payment gateway
        break;
      case RefundMethod.STORE_CREDIT:
        // Add to customer store credit
        break;
      case RefundMethod.GIFT_CARD:
        // Issue gift card
        break;
      case RefundMethod.BANK_TRANSFER:
        // Process bank transfer
        break;
      case RefundMethod.CHECK:
        // Issue check
        break;
      default:
        throw new BadRequestException(`Unsupported refund method: ${refund.method}`);
    }
  }

  private async calculateAverageProcessingTime(): Promise<number> {
    const result = await this.returnRepository
      .createQueryBuilder('return')
      .select('AVG(EXTRACT(EPOCH FROM (return.updatedAt - return.createdAt))/86400)', 'avgDays')
      .where('return.status = :status', { status: ReturnStatus.COMPLETED })
      .getRawOne();

    return parseFloat(result.avgDays) || 0;
  }
} 