import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Vendor, VendorStatus, VendorType, VendorTier } from './entities/vendor.entity';
import { VendorProduct, ProductStatus } from './entities/vendor-product.entity';
import { VendorCommission, CommissionStatus, CommissionType } from './entities/vendor-commission.entity';
import { VendorPayout, PayoutStatus, PayoutMethod } from './entities/vendor-payout.entity';
import { CreateVendorDto } from './dtos/create-vendor.dto';

@Injectable()
export class VendorsService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    @InjectRepository(VendorProduct)
    private vendorProductRepository: Repository<VendorProduct>,
    @InjectRepository(VendorCommission)
    private vendorCommissionRepository: Repository<VendorCommission>,
    @InjectRepository(VendorPayout)
    private vendorPayoutRepository: Repository<VendorPayout>,
  ) {}

  async createVendor(createVendorDto: CreateVendorDto): Promise<Vendor> {
    // Check if user already has a vendor account
    const existingVendor = await this.vendorRepository.findOne({
      where: { userId: createVendorDto.userId },
    });

    if (existingVendor) {
      throw new BadRequestException('User already has a vendor account');
    }

    // Generate vendor code
    const vendorCode = await this.generateVendorCode();

    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      vendorCode,
      status: VendorStatus.PENDING,
      tier: VendorTier.BRONZE,
    });

    return await this.vendorRepository.save(vendor);
  }

  async getVendorById(id: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ['products', 'commissions', 'payouts'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async getVendorByUserId(userId: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { userId },
      relations: ['products', 'commissions', 'payouts'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor for user ${userId} not found`);
    }

    return vendor;
  }

  async getVendorByCode(vendorCode: string): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { vendorCode },
      relations: ['products'],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with code ${vendorCode} not found`);
    }

    return vendor;
  }

  async getAllVendors(status?: VendorStatus): Promise<Vendor[]> {
    const query = this.vendorRepository.createQueryBuilder('vendor')
      .leftJoinAndSelect('vendor.products', 'products')
      .leftJoinAndSelect('vendor.commissions', 'commissions')
      .leftJoinAndSelect('vendor.payouts', 'payouts');

    if (status) {
      query.where('vendor.status = :status', { status });
    }

    return await query
      .orderBy('vendor.createdAt', 'DESC')
      .getMany();
  }

  async updateVendorStatus(id: string, status: VendorStatus, adminId?: string, reason?: string): Promise<Vendor> {
    const vendor = await this.getVendorById(id);

    vendor.status = status;

    if (status === VendorStatus.APPROVED) {
      vendor.approvedAt = new Date();
      if (adminId !== undefined && adminId !== null) {
        vendor.approvedBy = adminId;
      }
    } else if (status === VendorStatus.SUSPENDED) {
      vendor.suspendedAt = new Date();
      if (adminId !== undefined && adminId !== null) {
        vendor.suspendedBy = adminId;
      }
      if (reason !== undefined && reason !== null) {
        vendor.suspensionReason = reason;
      }
    } else if (status === VendorStatus.REJECTED) {
      if (reason !== undefined && reason !== null) {
        vendor.rejectionReason = reason;
      }
    }

    return await this.vendorRepository.save(vendor);
  }

  async updateVendorTier(id: string, tier: VendorTier): Promise<Vendor> {
    const vendor = await this.getVendorById(id);
    vendor.tier = tier;
    return await this.vendorRepository.save(vendor);
  }

  async addVendorProduct(vendorId: string, productData: Partial<VendorProduct>): Promise<VendorProduct> {
    const vendor = await this.getVendorById(vendorId);

    const vendorProduct = this.vendorProductRepository.create({
      ...productData,
      vendorId,
      status: ProductStatus.DRAFT,
    });

    const savedProduct = await this.vendorProductRepository.save(vendorProduct);

    // Update vendor product count
    vendor.totalProducts = await this.vendorProductRepository.count({
      where: { vendorId, status: ProductStatus.ACTIVE },
    });
    await this.vendorRepository.save(vendor);

    return savedProduct;
  }

  async updateVendorProduct(id: string, updateData: Partial<VendorProduct>): Promise<VendorProduct> {
    const product = await this.vendorProductRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Vendor product with ID ${id} not found`);
    }

    Object.assign(product, updateData);
    return await this.vendorProductRepository.save(product);
  }

  async approveVendorProduct(id: string, adminId: string): Promise<VendorProduct> {
    const product = await this.vendorProductRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Vendor product with ID ${id} not found`);
    }

    product.status = ProductStatus.APPROVED;
    product.approvedAt = new Date();
    product.approvedBy = adminId;

    return await this.vendorProductRepository.save(product);
  }

  async getVendorProducts(vendorId: string, status?: ProductStatus): Promise<VendorProduct[]> {
    const query = this.vendorProductRepository.createQueryBuilder('product')
      .where('product.vendorId = :vendorId', { vendorId });

    if (status) {
      query.andWhere('product.status = :status', { status });
    }

    return await query
      .orderBy('product.createdAt', 'DESC')
      .getMany();
  }

  async calculateCommission(vendorId: string, orderId: string, orderAmount: number): Promise<VendorCommission> {
    const vendor = await this.getVendorById(vendorId);
    
    const commissionAmount = (orderAmount * vendor.commissionRate) / 100;

    const commission = this.vendorCommissionRepository.create({
      vendorId,
      orderId,
      type: CommissionType.SALES,
      status: CommissionStatus.CALCULATED,
      orderAmount,
      commissionRate: vendor.commissionRate,
      commissionAmount,
      finalAmount: commissionAmount,
      calculatedAt: new Date(),
    });

    const savedCommission = await this.vendorCommissionRepository.save(commission);

    // Update vendor totals
    vendor.totalSales += orderAmount;
    vendor.totalCommission += commissionAmount;
    vendor.pendingPayout += commissionAmount;
    vendor.totalOrders += 1;
    await this.vendorRepository.save(vendor);

    return savedCommission;
  }

  async approveCommission(id: string, adminId: string): Promise<VendorCommission> {
    const commission = await this.vendorCommissionRepository.findOne({ where: { id } });
    if (!commission) {
      throw new NotFoundException(`Commission with ID ${id} not found`);
    }

    commission.status = CommissionStatus.APPROVED;
    commission.approvedAt = new Date();
    commission.approvedBy = adminId;

    return await this.vendorCommissionRepository.save(commission);
  }

  async getVendorCommissions(vendorId: string, status?: CommissionStatus): Promise<VendorCommission[]> {
    const query = this.vendorCommissionRepository.createQueryBuilder('commission')
      .where('commission.vendorId = :vendorId', { vendorId });

    if (status) {
      query.andWhere('commission.status = :status', { status });
    }

    return await query
      .orderBy('commission.createdAt', 'DESC')
      .getMany();
  }

  async createPayout(vendorId: string, payoutData: Partial<VendorPayout>): Promise<VendorPayout> {
    const vendor = await this.getVendorById(vendorId);

    if (vendor.pendingPayout < vendor.minimumPayoutAmount) {
      throw new BadRequestException(`Minimum payout amount not reached. Required: ${vendor.minimumPayoutAmount}`);
    }

    const payoutNumber = await this.generatePayoutNumber();

    const payout = this.vendorPayoutRepository.create({
      ...payoutData,
      vendorId,
      payoutNumber,
      status: PayoutStatus.PENDING,
      amount: vendor.pendingPayout,
      netAmount: vendor.pendingPayout - (payoutData.fee || 0),
    });

    return await this.vendorPayoutRepository.save(payout);
  }

  async processPayout(id: string, adminId: string): Promise<VendorPayout> {
    const payout = await this.vendorPayoutRepository.findOne({ where: { id } });
    if (!payout) {
      throw new NotFoundException(`Payout with ID ${id} not found`);
    }

    try {
      // Process payout based on method
      await this.processPayoutByMethod(payout);

      payout.status = PayoutStatus.COMPLETED;
      payout.completedAt = new Date();
      payout.completedBy = adminId;

      // Update vendor pending payout
      const vendor = await this.getVendorById(payout.vendorId);
      vendor.pendingPayout -= payout.amount;
      await this.vendorRepository.save(vendor);

      return await this.vendorPayoutRepository.save(payout);
    } catch (error) {
      payout.status = PayoutStatus.FAILED;
      payout.failureReason = error.message;
      await this.vendorPayoutRepository.save(payout);
      throw error;
    }
  }

  async getVendorPayouts(vendorId: string, status?: PayoutStatus): Promise<VendorPayout[]> {
    const query = this.vendorPayoutRepository.createQueryBuilder('payout')
      .where('payout.vendorId = :vendorId', { vendorId });

    if (status) {
      query.andWhere('payout.status = :status', { status });
    }

    return await query
      .orderBy('payout.createdAt', 'DESC')
      .getMany();
  }

  async getVendorAnalytics(vendorId: string): Promise<any> {
    const vendor = await this.getVendorById(vendorId);

    const [totalProducts, activeProducts, pendingCommissions, totalPayouts] = await Promise.all([
      this.vendorProductRepository.count({ where: { vendorId } }),
      this.vendorProductRepository.count({ where: { vendorId, status: ProductStatus.ACTIVE } }),
      this.vendorCommissionRepository.count({ where: { vendorId, status: CommissionStatus.PENDING } }),
      this.vendorPayoutRepository.count({ where: { vendorId } }),
    ]);

    const monthlySales = await this.vendorCommissionRepository
      .createQueryBuilder('commission')
      .select('SUM(commission.orderAmount)', 'total')
      .where('commission.vendorId = :vendorId', { vendorId })
      .andWhere('commission.createdAt >= :startDate', { 
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1) 
      })
      .getRawOne();

    const topProducts = await this.vendorProductRepository
      .createQueryBuilder('product')
      .select('product.productId', 'productId')
      .addSelect('SUM(product.totalSales)', 'totalSales')
      .where('product.vendorId = :vendorId', { vendorId })
      .groupBy('product.productId')
      .orderBy('totalSales', 'DESC')
      .limit(5)
      .getRawMany();

    return {
      vendor: {
        id: vendor.id,
        businessName: vendor.businessName,
        status: vendor.status,
        tier: vendor.tier,
      },
      totals: {
        totalSales: vendor.totalSales,
        totalCommission: vendor.totalCommission,
        pendingPayout: vendor.pendingPayout,
        totalProducts,
        activeProducts,
        totalOrders: vendor.totalOrders,
        averageRating: vendor.averageRating,
        totalReviews: vendor.totalReviews,
      },
      pending: {
        pendingCommissions,
        totalPayouts,
      },
      monthly: {
        sales: parseFloat(monthlySales.total) || 0,
      },
      topProducts,
    };
  }

  async getVendorsAnalytics(): Promise<any> {
    const [totalVendors, pendingVendors, approvedVendors, activeVendors] = await Promise.all([
      this.vendorRepository.count(),
      this.vendorRepository.count({ where: { status: VendorStatus.PENDING } }),
      this.vendorRepository.count({ where: { status: VendorStatus.APPROVED } }),
      this.vendorRepository.count({ where: { status: VendorStatus.APPROVED, isActive: true } }),
    ]);

    const totalSales = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select('SUM(vendor.totalSales)', 'total')
      .getRawOne();

    const totalCommission = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select('SUM(vendor.totalCommission)', 'total')
      .getRawOne();

    const vendorsByTier = await this.vendorRepository
      .createQueryBuilder('vendor')
      .select('vendor.tier', 'tier')
      .addSelect('COUNT(*)', 'count')
      .groupBy('vendor.tier')
      .getRawMany();

    return {
      overview: {
        totalVendors,
        pendingVendors,
        approvedVendors,
        activeVendors,
      },
      financials: {
        totalSales: parseFloat(totalSales.total) || 0,
        totalCommission: parseFloat(totalCommission.total) || 0,
      },
      distribution: {
        byTier: vendorsByTier,
      },
    };
  }

  private async generateVendorCode(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `VEND${timestamp}${random}`;
  }

  private async generatePayoutNumber(): Promise<string> {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `PAY${timestamp}${random}`;
  }

  private async processPayoutByMethod(payout: VendorPayout): Promise<void> {
    switch (payout.method) {
      case PayoutMethod.BANK_TRANSFER:
        // Process bank transfer
        break;
      case PayoutMethod.PAYPAL:
        // Process PayPal payment
        break;
      case PayoutMethod.STRIPE:
        // Process Stripe payment
        break;
      case PayoutMethod.CHECK:
        // Generate check
        break;
      case PayoutMethod.WIRE_TRANSFER:
        // Process wire transfer
        break;
      case PayoutMethod.DIGITAL_WALLET:
        // Process digital wallet payment
        break;
      default:
        throw new BadRequestException(`Unsupported payout method: ${payout.method}`);
    }
  }
} 