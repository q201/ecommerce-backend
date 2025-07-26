import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { VendorsService } from './vendors.service';
import { CreateVendorDto } from './dtos/create-vendor.dto';
import { VendorStatus, VendorTier } from './entities/vendor.entity';
import { ProductStatus } from './entities/vendor-product.entity';
import { CommissionStatus } from './entities/vendor-commission.entity';
import { PayoutStatus } from './entities/vendor-payout.entity';

@ApiTags('vendors')
@Controller('vendors')
export class VendorsController {
  constructor(private readonly vendorsService: VendorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create new vendor' })
  @ApiResponse({ status: 201, description: 'Vendor created successfully' })
  createVendor(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorsService.createVendor(createVendorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vendors' })
  @ApiResponse({ status: 200, description: 'List of vendors' })
  getAllVendors(@Query('status') status?: VendorStatus) {
    return this.vendorsService.getAllVendors(status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vendor by ID' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  getVendorById(@Param('id') id: string) {
    return this.vendorsService.getVendorById(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get vendor by user ID' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  getVendorByUserId(@Param('userId') userId: string) {
    return this.vendorsService.getVendorByUserId(userId);
  }

  @Get('code/:vendorCode')
  @ApiOperation({ summary: 'Get vendor by vendor code' })
  @ApiResponse({ status: 200, description: 'Vendor details' })
  getVendorByCode(@Param('vendorCode') vendorCode: string) {
    return this.vendorsService.getVendorByCode(vendorCode);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update vendor status' })
  @ApiResponse({ status: 200, description: 'Vendor status updated successfully' })
  updateVendorStatus(
    @Param('id') id: string,
    @Body('status') status: VendorStatus,
    @Body('adminId') adminId?: string,
    @Body('reason') reason?: string
  ) {
    return this.vendorsService.updateVendorStatus(id, status, adminId, reason);
  }

  @Put(':id/tier')
  @ApiOperation({ summary: 'Update vendor tier' })
  @ApiResponse({ status: 200, description: 'Vendor tier updated successfully' })
  updateVendorTier(
    @Param('id') id: string,
    @Body('tier') tier: VendorTier
  ) {
    return this.vendorsService.updateVendorTier(id, tier);
  }

  @Post(':id/products')
  @ApiOperation({ summary: 'Add vendor product' })
  @ApiResponse({ status: 201, description: 'Vendor product added successfully' })
  addVendorProduct(
    @Param('id') vendorId: string,
    @Body() productData: any
  ) {
    return this.vendorsService.addVendorProduct(vendorId, productData);
  }

  @Put('products/:id')
  @ApiOperation({ summary: 'Update vendor product' })
  @ApiResponse({ status: 200, description: 'Vendor product updated successfully' })
  updateVendorProduct(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.vendorsService.updateVendorProduct(id, updateData);
  }

  @Post('products/:id/approve')
  @ApiOperation({ summary: 'Approve vendor product' })
  @ApiResponse({ status: 200, description: 'Vendor product approved successfully' })
  approveVendorProduct(
    @Param('id') id: string,
    @Body('adminId') adminId: string
  ) {
    return this.vendorsService.approveVendorProduct(id, adminId);
  }

  @Get(':id/products')
  @ApiOperation({ summary: 'Get vendor products' })
  @ApiResponse({ status: 200, description: 'Vendor products' })
  getVendorProducts(
    @Param('id') vendorId: string,
    @Query('status') status?: ProductStatus
  ) {
    return this.vendorsService.getVendorProducts(vendorId, status);
  }

  @Post(':id/commissions')
  @ApiOperation({ summary: 'Calculate commission for vendor' })
  @ApiResponse({ status: 201, description: 'Commission calculated successfully' })
  calculateCommission(
    @Param('id') vendorId: string,
    @Body('orderId') orderId: string,
    @Body('orderAmount') orderAmount: number
  ) {
    return this.vendorsService.calculateCommission(vendorId, orderId, orderAmount);
  }

  @Post('commissions/:id/approve')
  @ApiOperation({ summary: 'Approve commission' })
  @ApiResponse({ status: 200, description: 'Commission approved successfully' })
  approveCommission(
    @Param('id') id: string,
    @Body('adminId') adminId: string
  ) {
    return this.vendorsService.approveCommission(id, adminId);
  }

  @Get(':id/commissions')
  @ApiOperation({ summary: 'Get vendor commissions' })
  @ApiResponse({ status: 200, description: 'Vendor commissions' })
  getVendorCommissions(
    @Param('id') vendorId: string,
    @Query('status') status?: CommissionStatus
  ) {
    return this.vendorsService.getVendorCommissions(vendorId, status);
  }

  @Post(':id/payouts')
  @ApiOperation({ summary: 'Create vendor payout' })
  @ApiResponse({ status: 201, description: 'Payout created successfully' })
  createPayout(
    @Param('id') vendorId: string,
    @Body() payoutData: any
  ) {
    return this.vendorsService.createPayout(vendorId, payoutData);
  }

  @Post('payouts/:id/process')
  @ApiOperation({ summary: 'Process vendor payout' })
  @ApiResponse({ status: 200, description: 'Payout processed successfully' })
  processPayout(
    @Param('id') id: string,
    @Body('adminId') adminId: string
  ) {
    return this.vendorsService.processPayout(id, adminId);
  }

  @Get(':id/payouts')
  @ApiOperation({ summary: 'Get vendor payouts' })
  @ApiResponse({ status: 200, description: 'Vendor payouts' })
  getVendorPayouts(
    @Param('id') vendorId: string,
    @Query('status') status?: PayoutStatus
  ) {
    return this.vendorsService.getVendorPayouts(vendorId, status);
  }

  @Get(':id/analytics')
  @ApiOperation({ summary: 'Get vendor analytics' })
  @ApiResponse({ status: 200, description: 'Vendor analytics' })
  getVendorAnalytics(@Param('id') vendorId: string) {
    return this.vendorsService.getVendorAnalytics(vendorId);
  }

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get vendors analytics overview' })
  @ApiResponse({ status: 200, description: 'Vendors analytics overview' })
  getVendorsAnalytics() {
    return this.vendorsService.getVendorsAnalytics();
  }

  @Get('status/pending')
  @ApiOperation({ summary: 'Get pending vendors' })
  @ApiResponse({ status: 200, description: 'Pending vendors' })
  getPendingVendors() {
    return this.vendorsService.getAllVendors(VendorStatus.PENDING);
  }

  @Get('status/approved')
  @ApiOperation({ summary: 'Get approved vendors' })
  @ApiResponse({ status: 200, description: 'Approved vendors' })
  getApprovedVendors() {
    return this.vendorsService.getAllVendors(VendorStatus.APPROVED);
  }

  @Get('status/suspended')
  @ApiOperation({ summary: 'Get suspended vendors' })
  @ApiResponse({ status: 200, description: 'Suspended vendors' })
  getSuspendedVendors() {
    return this.vendorsService.getAllVendors(VendorStatus.SUSPENDED);
  }

  @Get('types')
  @ApiOperation({ summary: 'Get vendor types' })
  @ApiResponse({ status: 200, description: 'Available vendor types' })
  getVendorTypes() {
    return {
      types: [
        { code: 'INDIVIDUAL', name: 'Individual', description: 'Individual vendor' },
        { code: 'BUSINESS', name: 'Business', description: 'Business vendor' },
        { code: 'CORPORATE', name: 'Corporate', description: 'Corporate vendor' },
        { code: 'PARTNERSHIP', name: 'Partnership', description: 'Partnership vendor' },
      ],
    };
  }

  @Get('tiers')
  @ApiOperation({ summary: 'Get vendor tiers' })
  @ApiResponse({ status: 200, description: 'Available vendor tiers' })
  getVendorTiers() {
    return {
      tiers: [
        { code: 'BRONZE', name: 'Bronze', description: 'Bronze tier vendor' },
        { code: 'SILVER', name: 'Silver', description: 'Silver tier vendor' },
        { code: 'GOLD', name: 'Gold', description: 'Gold tier vendor' },
        { code: 'PLATINUM', name: 'Platinum', description: 'Platinum tier vendor' },
        { code: 'DIAMOND', name: 'Diamond', description: 'Diamond tier vendor' },
      ],
    };
  }

  @Get('payout-methods')
  @ApiOperation({ summary: 'Get payout methods' })
  @ApiResponse({ status: 200, description: 'Available payout methods' })
  getPayoutMethods() {
    return {
      methods: [
        { code: 'BANK_TRANSFER', name: 'Bank Transfer', description: 'Direct bank transfer' },
        { code: 'PAYPAL', name: 'PayPal', description: 'PayPal payment' },
        { code: 'STRIPE', name: 'Stripe', description: 'Stripe payment' },
        { code: 'CHECK', name: 'Check', description: 'Paper check' },
        { code: 'WIRE_TRANSFER', name: 'Wire Transfer', description: 'Wire transfer' },
        { code: 'DIGITAL_WALLET', name: 'Digital Wallet', description: 'Digital wallet payment' },
      ],
    };
  }
} 