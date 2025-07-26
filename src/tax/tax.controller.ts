import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TaxService } from './tax.service';
import { CalculateTaxDto } from './dtos/calculate-tax.dto';
import { ExemptionStatus } from './entities/tax-exemption.entity';

@ApiTags('tax')
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate tax for order' })
  @ApiResponse({ status: 200, description: 'Tax calculation results' })
  calculateTax(@Body() calculateTaxDto: CalculateTaxDto) {
    return this.taxService.calculateTax(calculateTaxDto);
  }

  @Get('rates')
  @ApiOperation({ summary: 'Get all tax rates' })
  @ApiResponse({ status: 200, description: 'List of tax rates' })
  getAllTaxRates() {
    return this.taxService.getAllTaxRates();
  }

  @Get('rates/:id')
  @ApiOperation({ summary: 'Get tax rate by ID' })
  @ApiResponse({ status: 200, description: 'Tax rate details' })
  getTaxRateById(@Param('id') id: string) {
    return this.taxService.getTaxRateById(id);
  }

  @Post('rates')
  @ApiOperation({ summary: 'Create new tax rate' })
  @ApiResponse({ status: 201, description: 'Tax rate created successfully' })
  createTaxRate(@Body() rateData: any) {
    return this.taxService.createTaxRate(rateData);
  }

  @Put('rates/:id')
  @ApiOperation({ summary: 'Update tax rate' })
  @ApiResponse({ status: 200, description: 'Tax rate updated successfully' })
  updateTaxRate(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.taxService.updateTaxRate(id, updateData);
  }

  @Delete('rates/:id')
  @ApiOperation({ summary: 'Delete tax rate' })
  @ApiResponse({ status: 200, description: 'Tax rate deleted successfully' })
  deleteTaxRate(@Param('id') id: string) {
    return this.taxService.deleteTaxRate(id);
  }

  @Get('rules')
  @ApiOperation({ summary: 'Get all tax rules' })
  @ApiResponse({ status: 200, description: 'List of tax rules' })
  getAllTaxRules() {
    return this.taxService.getAllTaxRules();
  }

  @Post('rules')
  @ApiOperation({ summary: 'Create new tax rule' })
  @ApiResponse({ status: 201, description: 'Tax rule created successfully' })
  createTaxRule(@Body() ruleData: any) {
    return this.taxService.createTaxRule(ruleData);
  }

  @Put('rules/:id')
  @ApiOperation({ summary: 'Update tax rule' })
  @ApiResponse({ status: 200, description: 'Tax rule updated successfully' })
  updateTaxRule(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.taxService.updateTaxRule(id, updateData);
  }

  @Delete('rules/:id')
  @ApiOperation({ summary: 'Delete tax rule' })
  @ApiResponse({ status: 200, description: 'Tax rule deleted successfully' })
  deleteTaxRule(@Param('id') id: string) {
    return this.taxService.deleteTaxRule(id);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all tax categories' })
  @ApiResponse({ status: 200, description: 'List of tax categories' })
  getAllTaxCategories() {
    return this.taxService.getAllTaxCategories();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create new tax category' })
  @ApiResponse({ status: 201, description: 'Tax category created successfully' })
  createTaxCategory(@Body() categoryData: any) {
    return this.taxService.createTaxCategory(categoryData);
  }

  @Put('categories/:id')
  @ApiOperation({ summary: 'Update tax category' })
  @ApiResponse({ status: 200, description: 'Tax category updated successfully' })
  updateTaxCategory(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.taxService.updateTaxCategory(id, updateData);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete tax category' })
  @ApiResponse({ status: 200, description: 'Tax category deleted successfully' })
  deleteTaxCategory(@Param('id') id: string) {
    return this.taxService.deleteTaxCategory(id);
  }

  @Get('exemptions')
  @ApiOperation({ summary: 'Get tax exemptions' })
  @ApiResponse({ status: 200, description: 'List of tax exemptions' })
  getTaxExemptions(@Query('status') status?: ExemptionStatus) {
    // This would be implemented in the service
    return { message: 'Tax exemptions endpoint' };
  }

  @Post('exemptions')
  @ApiOperation({ summary: 'Create tax exemption' })
  @ApiResponse({ status: 201, description: 'Tax exemption created successfully' })
  createTaxExemption(@Body() exemptionData: any) {
    return this.taxService.createTaxExemption(exemptionData);
  }

  @Put('exemptions/:id')
  @ApiOperation({ summary: 'Update tax exemption' })
  @ApiResponse({ status: 200, description: 'Tax exemption updated successfully' })
  updateTaxExemption(
    @Param('id') id: string,
    @Body() updateData: any
  ) {
    return this.taxService.updateTaxExemption(id, updateData);
  }

  @Post('exemptions/:id/approve')
  @ApiOperation({ summary: 'Approve tax exemption' })
  @ApiResponse({ status: 200, description: 'Tax exemption approved successfully' })
  approveTaxExemption(
    @Param('id') id: string,
    @Body('approvedBy') approvedBy: string
  ) {
    return this.taxService.approveTaxExemption(id, approvedBy);
  }

  @Post('exemptions/:id/reject')
  @ApiOperation({ summary: 'Reject tax exemption' })
  @ApiResponse({ status: 200, description: 'Tax exemption rejected successfully' })
  rejectTaxExemption(
    @Param('id') id: string,
    @Body('rejectionReason') rejectionReason: string
  ) {
    return this.taxService.rejectTaxExemption(id, rejectionReason);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Get tax analytics' })
  @ApiResponse({ status: 200, description: 'Tax analytics data' })
  getTaxAnalytics() {
    return this.taxService.getTaxAnalytics();
  }

  @Get('types')
  @ApiOperation({ summary: 'Get tax types' })
  @ApiResponse({ status: 200, description: 'Available tax types' })
  getTaxTypes() {
    return {
      types: [
        { code: 'SALES_TAX', name: 'Sales Tax', description: 'General sales tax' },
        { code: 'VAT', name: 'Value Added Tax', description: 'Value added tax' },
        { code: 'GST', name: 'Goods and Services Tax', description: 'GST tax' },
        { code: 'HST', name: 'Harmonized Sales Tax', description: 'HST tax' },
        { code: 'PST', name: 'Provincial Sales Tax', description: 'Provincial sales tax' },
        { code: 'IMPORT_DUTY', name: 'Import Duty', description: 'Import duty tax' },
        { code: 'EXCISE_TAX', name: 'Excise Tax', description: 'Excise tax' },
        { code: 'DIGITAL_TAX', name: 'Digital Tax', description: 'Digital services tax' },
      ],
    };
  }

  @Get('calculation-types')
  @ApiOperation({ summary: 'Get tax calculation types' })
  @ApiResponse({ status: 200, description: 'Available calculation types' })
  getCalculationTypes() {
    return {
      types: [
        { code: 'PERCENTAGE', name: 'Percentage', description: 'Percentage-based calculation' },
        { code: 'FIXED_AMOUNT', name: 'Fixed Amount', description: 'Fixed amount calculation' },
        { code: 'COMPOUND', name: 'Compound', description: 'Compound calculation' },
      ],
    };
  }

  @Get('rule-types')
  @ApiOperation({ summary: 'Get tax rule types' })
  @ApiResponse({ status: 200, description: 'Available rule types' })
  getRuleTypes() {
    return {
      types: [
        { code: 'PRODUCT_BASED', name: 'Product Based', description: 'Product-based rules' },
        { code: 'CUSTOMER_BASED', name: 'Customer Based', description: 'Customer-based rules' },
        { code: 'LOCATION_BASED', name: 'Location Based', description: 'Location-based rules' },
        { code: 'AMOUNT_BASED', name: 'Amount Based', description: 'Amount-based rules' },
        { code: 'TIME_BASED', name: 'Time Based', description: 'Time-based rules' },
        { code: 'COMPOUND', name: 'Compound', description: 'Compound rules' },
      ],
    };
  }

  @Get('category-types')
  @ApiOperation({ summary: 'Get tax category types' })
  @ApiResponse({ status: 200, description: 'Available category types' })
  getCategoryTypes() {
    return {
      types: [
        { code: 'GENERAL', name: 'General', description: 'General products' },
        { code: 'FOOD', name: 'Food', description: 'Food products' },
        { code: 'CLOTHING', name: 'Clothing', description: 'Clothing items' },
        { code: 'BOOKS', name: 'Books', description: 'Books and publications' },
        { code: 'MEDICAL', name: 'Medical', description: 'Medical products' },
        { code: 'DIGITAL', name: 'Digital', description: 'Digital products' },
        { code: 'SERVICES', name: 'Services', description: 'Service products' },
        { code: 'LUXURY', name: 'Luxury', description: 'Luxury items' },
        { code: 'ESSENTIAL', name: 'Essential', description: 'Essential items' },
        { code: 'EXEMPT', name: 'Exempt', description: 'Tax exempt items' },
      ],
    };
  }
} 