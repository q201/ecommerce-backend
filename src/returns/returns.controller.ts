import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReturnsService } from './returns.service';
import { CreateReturnDto } from './dtos/create-return.dto';
import { ReturnStatus } from './entities/return.entity';
import { RefundMethod, RefundType } from './entities/refund.entity';

@ApiTags('returns')
@Controller('returns')
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new return request' })
  @ApiResponse({ status: 201, description: 'Return request created successfully' })
  createReturn(@Body() createReturnDto: CreateReturnDto) {
    return this.returnsService.createReturn(createReturnDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get return by ID' })
  @ApiResponse({ status: 200, description: 'Return details' })
  getReturnById(@Param('id') id: string) {
    return this.returnsService.getReturnById(id);
  }

  @Get('number/:returnNumber')
  @ApiOperation({ summary: 'Get return by return number' })
  @ApiResponse({ status: 200, description: 'Return details' })
  getReturnByNumber(@Param('returnNumber') returnNumber: string) {
    return this.returnsService.getReturnByNumber(returnNumber);
  }

  @Get('customer/:customerId')
  @ApiOperation({ summary: 'Get customer returns' })
  @ApiResponse({ status: 200, description: 'Customer returns' })
  getCustomerReturns(@Param('customerId') customerId: string) {
    return this.returnsService.getCustomerReturns(customerId);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get order returns' })
  @ApiResponse({ status: 200, description: 'Order returns' })
  getOrderReturns(@Param('orderId') orderId: string) {
    return this.returnsService.getOrderReturns(orderId);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update return status' })
  @ApiResponse({ status: 200, description: 'Return status updated successfully' })
  updateReturnStatus(
    @Param('id') id: string,
    @Body('status') status: ReturnStatus,
    @Body('adminNotes') adminNotes?: string
  ) {
    return this.returnsService.updateReturnStatus(id, status, adminNotes);
  }

  @Post(':id/refunds')
  @ApiOperation({ summary: 'Create refund for return' })
  @ApiResponse({ status: 201, description: 'Refund created successfully' })
  createRefund(
    @Param('id') returnId: string,
    @Body() refundData: any
  ) {
    return this.returnsService.createRefund(returnId, refundData);
  }

  @Post('refunds/:refundId/process')
  @ApiOperation({ summary: 'Process refund' })
  @ApiResponse({ status: 200, description: 'Refund processed successfully' })
  processRefund(@Param('refundId') refundId: string) {
    return this.returnsService.processRefund(refundId);
  }

  @Get('reasons')
  @ApiOperation({ summary: 'Get return reasons' })
  @ApiResponse({ status: 200, description: 'Return reasons' })
  getReturnReasons() {
    return this.returnsService.getReturnReasons();
  }

  @Post('reasons')
  @ApiOperation({ summary: 'Create return reason' })
  @ApiResponse({ status: 201, description: 'Return reason created successfully' })
  createReturnReason(@Body() reasonData: any) {
    return this.returnsService.createReturnReason(reasonData);
  }

  @Put('reasons/:id')
  @ApiOperation({ summary: 'Update return reason' })
  @ApiResponse({ status: 200, description: 'Return reason updated successfully' })
  updateReturnReason(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.returnsService.updateReturnReason(id, updateData);
  }

  @Delete('reasons/:id')
  @ApiOperation({ summary: 'Delete return reason' })
  @ApiResponse({ status: 200, description: 'Return reason deleted successfully' })
  deleteReturnReason(@Param('id') id: string) {
    return this.returnsService.deleteReturnReason(id);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get returns analytics' })
  @ApiResponse({ status: 200, description: 'Returns analytics' })
  getReturnsAnalytics() {
    return this.returnsService.getReturnsAnalytics();
  }

  @Post(':id/label')
  @ApiOperation({ summary: 'Generate return shipping label' })
  @ApiResponse({ status: 200, description: 'Shipping label generated' })
  generateReturnLabel(@Param('id') returnId: string) {
    return this.returnsService.generateReturnLabel(returnId);
  }

  @Get('status/pending')
  @ApiOperation({ summary: 'Get pending returns' })
  @ApiResponse({ status: 200, description: 'Pending returns' })
  getPendingReturns() {
    // This would be implemented in the service
    return { message: 'Pending returns endpoint' };
  }

  @Get('status/approved')
  @ApiOperation({ summary: 'Get approved returns' })
  @ApiResponse({ status: 200, description: 'Approved returns' })
  getApprovedReturns() {
    // This would be implemented in the service
    return { message: 'Approved returns endpoint' };
  }

  @Get('status/completed')
  @ApiOperation({ summary: 'Get completed returns' })
  @ApiResponse({ status: 200, description: 'Completed returns' })
  getCompletedReturns() {
    // This would be implemented in the service
    return { message: 'Completed returns endpoint' };
  }

  @Get('methods/refund')
  @ApiOperation({ summary: 'Get refund methods' })
  @ApiResponse({ status: 200, description: 'Available refund methods' })
  getRefundMethods() {
    return {
      methods: [
        { code: 'ORIGINAL_PAYMENT', name: 'Original Payment Method', description: 'Refund to original payment method' },
        { code: 'STORE_CREDIT', name: 'Store Credit', description: 'Add to customer store credit' },
        { code: 'GIFT_CARD', name: 'Gift Card', description: 'Issue gift card' },
        { code: 'BANK_TRANSFER', name: 'Bank Transfer', description: 'Direct bank transfer' },
        { code: 'CHECK', name: 'Check', description: 'Issue check' },
      ],
    };
  }

  @Get('types/refund')
  @ApiOperation({ summary: 'Get refund types' })
  @ApiResponse({ status: 200, description: 'Available refund types' })
  getRefundTypes() {
    return {
      types: [
        { code: 'FULL', name: 'Full Refund', description: 'Full amount refund' },
        { code: 'PARTIAL', name: 'Partial Refund', description: 'Partial amount refund' },
        { code: 'RESTOCKING_FEE', name: 'Restocking Fee', description: 'Restocking fee only' },
        { code: 'SHIPPING', name: 'Shipping Refund', description: 'Shipping cost refund' },
      ],
    };
  }

  @Get('conditions/item')
  @ApiOperation({ summary: 'Get item conditions' })
  @ApiResponse({ status: 200, description: 'Available item conditions' })
  getItemConditions() {
    return {
      conditions: [
        { code: 'NEW', name: 'New', description: 'Unused, original packaging' },
        { code: 'LIKE_NEW', name: 'Like New', description: 'Used but in excellent condition' },
        { code: 'GOOD', name: 'Good', description: 'Used, minor wear' },
        { code: 'FAIR', name: 'Fair', description: 'Used, noticeable wear' },
        { code: 'POOR', name: 'Poor', description: 'Heavily used, significant wear' },
        { code: 'DAMAGED', name: 'Damaged', description: 'Damaged or defective' },
      ],
    };
  }
} 