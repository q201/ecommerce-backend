import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ShippingService } from './shipping.service';
import { CalculateShippingDto } from './dtos/calculate-shipping.dto';

@ApiTags('shipping')
@Controller('shipping')
export class ShippingController {
  constructor(private readonly shippingService: ShippingService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate shipping costs' })
  @ApiResponse({ status: 200, description: 'Shipping calculation results' })
  calculateShipping(@Body() calculateShippingDto: CalculateShippingDto) {
    return this.shippingService.calculateShipping(calculateShippingDto);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get all shipping methods' })
  @ApiResponse({ status: 200, description: 'List of shipping methods' })
  getAllShippingMethods() {
    return this.shippingService.getAllShippingMethods();
  }

  @Get('methods/:id')
  @ApiOperation({ summary: 'Get shipping method by ID' })
  @ApiResponse({ status: 200, description: 'Shipping method details' })
  getShippingMethodById(@Param('id') id: string) {
    return this.shippingService.getShippingMethodById(id);
  }

  @Post('methods')
  @ApiOperation({ summary: 'Create new shipping method' })
  @ApiResponse({ status: 201, description: 'Shipping method created successfully' })
  createShippingMethod(@Body() methodData: any) {
    return this.shippingService.createShippingMethod(methodData);
  }

  @Put('methods/:id')
  @ApiOperation({ summary: 'Update shipping method' })
  @ApiResponse({ status: 200, description: 'Shipping method updated successfully' })
  updateShippingMethod(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.shippingService.updateShippingMethod(id, updateData);
  }

  @Delete('methods/:id')
  @ApiOperation({ summary: 'Delete shipping method' })
  @ApiResponse({ status: 200, description: 'Shipping method deleted successfully' })
  deleteShippingMethod(@Param('id') id: string) {
    return this.shippingService.deleteShippingMethod(id);
  }

  @Get('zones')
  @ApiOperation({ summary: 'Get all shipping zones' })
  @ApiResponse({ status: 200, description: 'List of shipping zones' })
  getAllShippingZones() {
    return this.shippingService.getAllShippingZones();
  }

  @Get('zones/:id')
  @ApiOperation({ summary: 'Get shipping zone by ID' })
  @ApiResponse({ status: 200, description: 'Shipping zone details' })
  getShippingZoneById(@Param('id') id: string) {
    return this.shippingService.getShippingZoneById(id);
  }

  @Post('zones')
  @ApiOperation({ summary: 'Create new shipping zone' })
  @ApiResponse({ status: 201, description: 'Shipping zone created successfully' })
  createShippingZone(@Body() zoneData: any) {
    return this.shippingService.createShippingZone(zoneData);
  }

  @Put('zones/:id')
  @ApiOperation({ summary: 'Update shipping zone' })
  @ApiResponse({ status: 200, description: 'Shipping zone updated successfully' })
  updateShippingZone(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.shippingService.updateShippingZone(id, updateData);
  }

  @Delete('zones/:id')
  @ApiOperation({ summary: 'Delete shipping zone' })
  @ApiResponse({ status: 200, description: 'Shipping zone deleted successfully' })
  deleteShippingZone(@Param('id') id: string) {
    return this.shippingService.deleteShippingZone(id);
  }

  @Get('delivery-slots')
  @ApiOperation({ summary: 'Get delivery slots for a date' })
  @ApiResponse({ status: 200, description: 'Available delivery slots' })
  getDeliverySlots(
    @Query('date') date: string,
    @Query('methodId') methodId?: string
  ) {
    return this.shippingService.getDeliverySlots(date, methodId);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get shipping analytics' })
  @ApiResponse({ status: 200, description: 'Shipping analytics data' })
  getShippingAnalytics() {
    return this.shippingService.getShippingAnalytics();
  }

  @Post('validate-address')
  @ApiOperation({ summary: 'Validate shipping address' })
  @ApiResponse({ status: 200, description: 'Address validation result' })
  validateAddress(@Body() address: any) {
    return this.shippingService.findShippingZone(address);
  }

  @Get('providers')
  @ApiOperation({ summary: 'Get available shipping providers' })
  @ApiResponse({ status: 200, description: 'List of shipping providers' })
  getShippingProviders() {
    return {
      providers: [
        { code: 'FEDEX', name: 'FedEx', description: 'Federal Express' },
        { code: 'UPS', name: 'UPS', description: 'United Parcel Service' },
        { code: 'DHL', name: 'DHL', description: 'DHL Express' },
        { code: 'USPS', name: 'USPS', description: 'United States Postal Service' },
        { code: 'CUSTOM', name: 'Custom', description: 'Custom shipping method' },
        { code: 'LOCAL', name: 'Local', description: 'Local delivery service' },
      ],
    };
  }

  @Get('methods/types')
  @ApiOperation({ summary: 'Get shipping method types' })
  @ApiResponse({ status: 200, description: 'List of shipping method types' })
  getShippingMethodTypes() {
    return {
      types: [
        { code: 'FLAT_RATE', name: 'Flat Rate', description: 'Fixed shipping cost' },
        { code: 'FREE_SHIPPING', name: 'Free Shipping', description: 'No shipping cost' },
        { code: 'WEIGHT_BASED', name: 'Weight Based', description: 'Cost based on weight' },
        { code: 'PRICE_BASED', name: 'Price Based', description: 'Cost based on order value' },
        { code: 'REAL_TIME', name: 'Real Time', description: 'Real-time carrier rates' },
        { code: 'LOCAL_PICKUP', name: 'Local Pickup', description: 'Customer pickup' },
      ],
    };
  }
} 