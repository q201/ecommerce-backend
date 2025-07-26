import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TaxRate, TaxType, TaxCalculationType } from './entities/tax-rate.entity';
import { TaxRule, RuleType, RuleOperator } from './entities/tax-rule.entity';
import { TaxCategory, TaxCategoryType } from './entities/tax-category.entity';
import { TaxExemption, ExemptionType, ExemptionStatus } from './entities/tax-exemption.entity';
import { CalculateTaxDto, AddressDto, TaxableItemDto } from './dtos/calculate-tax.dto';

@Injectable()
export class TaxService {
  constructor(
    @InjectRepository(TaxRate)
    private taxRateRepository: Repository<TaxRate>,
    @InjectRepository(TaxRule)
    private taxRuleRepository: Repository<TaxRule>,
    @InjectRepository(TaxCategory)
    private taxCategoryRepository: Repository<TaxCategory>,
    @InjectRepository(TaxExemption)
    private taxExemptionRepository: Repository<TaxExemption>,
  ) {}

  async calculateTax(calculateTaxDto: CalculateTaxDto): Promise<any> {
    const { billingAddress, items, subtotal, shippingAmount = 0, customerId, exemptionCertificate } = calculateTaxDto;

    // Check for tax exemptions
    const exemptions = await this.getCustomerExemptions(customerId, exemptionCertificate);
    
    // Get applicable tax rates
    const taxRates = await this.getApplicableTaxRates(billingAddress);
    
    // Get applicable tax rules
    const taxRules = await this.getApplicableTaxRules(calculateTaxDto);
    
    // Calculate taxes for each item
    const itemTaxes = await Promise.all(
      items.map(item => this.calculateItemTax(item, taxRates, taxRules, exemptions))
    );

    // Calculate shipping tax
    const shippingTax = await this.calculateShippingTax(shippingAmount, taxRates, billingAddress);

    // Calculate total tax
    const totalItemTax = itemTaxes.reduce((sum, item) => sum + item.totalTax, 0);
    const totalTax = totalItemTax + shippingTax;

    // Apply tax rules
    const adjustedTax = await this.applyTaxRules(totalTax, taxRules, calculateTaxDto);

    return {
      subtotal,
      shippingAmount,
      totalTax: adjustedTax,
      totalAmount: subtotal + shippingAmount + adjustedTax,
      breakdown: {
        itemTaxes,
        shippingTax,
        exemptions: exemptions.map(ex => ({
          type: ex.type,
          reason: ex.reason,
          amount: ex.maximumAmount || 0,
        })),
      },
      taxRates: taxRates.map(rate => ({
        name: rate.name,
        type: rate.type,
        rate: rate.rate,
        amount: 0, // This would be calculated per item
      })),
    };
  }

  async getApplicableTaxRates(address: AddressDto): Promise<TaxRate[]> {
    const query = this.taxRateRepository.createQueryBuilder('rate')
      .where('rate.isActive = :isActive', { isActive: true })
      .andWhere('rate.country = :country', { country: address.country });

    if (address.state) {
      query.andWhere('(rate.state = :state OR rate.state IS NULL)', { state: address.state });
    }

    if (address.city) {
      query.andWhere('(rate.city = :city OR rate.city IS NULL)', { city: address.city });
    }

    if (address.postalCode) {
      query.andWhere('(rate.postalCode = :postalCode OR rate.postalCode IS NULL)', { postalCode: address.postalCode });
    }

    return await query
      .orderBy('rate.priority', 'DESC')
      .addOrderBy('rate.rate', 'DESC')
      .getMany();
  }

  async getApplicableTaxRules(calculateTaxDto: CalculateTaxDto): Promise<TaxRule[]> {
    const rules = await this.taxRuleRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC' },
    });

    return rules.filter(rule => this.evaluateTaxRule(rule, calculateTaxDto));
  }

  private evaluateTaxRule(rule: TaxRule, data: CalculateTaxDto): boolean {
    for (const condition of rule.conditions) {
      const fieldValue = this.getFieldValue(condition.field, data);
      if (!this.evaluateCondition(condition, fieldValue)) {
        return false;
      }
    }
    return true;
  }

  private getFieldValue(field: string, data: any): any {
    const fieldMap = {
      'customer.type': data.customerType,
      'order.subtotal': data.subtotal,
      'order.shipping': data.shippingAmount,
      'address.country': data.billingAddress.country,
      'address.state': data.billingAddress.state,
      'address.city': data.billingAddress.city,
      'items.count': data.items.length,
      'items.total': data.items.reduce((sum, item) => sum + item.totalPrice, 0),
    };

    return fieldMap[field] || null;
  }

  private evaluateCondition(condition: any, fieldValue: any): boolean {
    const { operator, value, value2 } = condition;

    switch (operator) {
      case RuleOperator.EQUALS:
        return fieldValue === value;
      case RuleOperator.NOT_EQUALS:
        return fieldValue !== value;
      case RuleOperator.GREATER_THAN:
        return fieldValue > value;
      case RuleOperator.LESS_THAN:
        return fieldValue < value;
      case RuleOperator.GREATER_EQUAL:
        return fieldValue >= value;
      case RuleOperator.LESS_EQUAL:
        return fieldValue <= value;
      case RuleOperator.CONTAINS:
        return String(fieldValue).includes(String(value));
      case RuleOperator.NOT_CONTAINS:
        return !String(fieldValue).includes(String(value));
      case RuleOperator.IN:
        return Array.isArray(value) && value.includes(fieldValue);
      case RuleOperator.NOT_IN:
        return Array.isArray(value) && !value.includes(fieldValue);
      case RuleOperator.BETWEEN:
        return fieldValue >= value && fieldValue <= value2;
      case RuleOperator.NOT_BETWEEN:
        return fieldValue < value || fieldValue > value2;
      default:
        return false;
    }
  }

  async calculateItemTax(
    item: TaxableItemDto,
    taxRates: TaxRate[],
    taxRules: TaxRule[],
    exemptions: TaxExemption[]
  ): Promise<any> {
    // Check if item is exempt
    const itemExemptions = exemptions.filter(ex => 
      ex.applicableProducts?.includes(item.productId) ||
      ex.applicableCategories?.includes(item.category)
    );

    if (itemExemptions.length > 0) {
      return {
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalPrice,
        totalTax: 0,
        exempt: true,
        exemptions: itemExemptions.map(ex => ({
          type: ex.type,
          reason: ex.reason,
        })),
      };
    }

    // Get product tax category
    const taxCategory = await this.getProductTaxCategory(item);
    
    // Calculate tax for each applicable rate
    const taxBreakdown = [];
    let totalTax = 0;

    for (const rate of taxRates) {
      if (this.isRateApplicableToItem(rate, item, taxCategory)) {
        const taxAmount = this.calculateTaxAmount(item.totalPrice, rate);
        taxBreakdown.push({
          rateId: rate.id,
          rateName: rate.name,
          rateType: rate.type,
          rate: rate.rate,
          amount: taxAmount,
        });
        totalTax += taxAmount;
      }
    }

    return {
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      totalTax,
      exempt: false,
      taxBreakdown,
    };
  }

  async calculateShippingTax(
    shippingAmount: number,
    taxRates: TaxRate[],
    address: AddressDto
  ): Promise<number> {
    if (shippingAmount <= 0) return 0;

    let totalShippingTax = 0;

    for (const rate of taxRates) {
      if (rate.isShippingTaxable) {
        const taxAmount = this.calculateTaxAmount(shippingAmount, rate);
        totalShippingTax += taxAmount;
      }
    }

    return totalShippingTax;
  }

  private calculateTaxAmount(amount: number, rate: TaxRate): number {
    if (amount < rate.minimumAmount) return 0;
    if (rate.maximumAmount && amount > rate.maximumAmount) {
      amount = rate.maximumAmount;
    }

    switch (rate.calculationType) {
      case TaxCalculationType.PERCENTAGE:
        return amount * rate.rate;
      case TaxCalculationType.FIXED_AMOUNT:
        return rate.fixedAmount;
      case TaxCalculationType.COMPOUND:
        return amount * rate.rate + rate.fixedAmount;
      default:
        return 0;
    }
  }

  private async getProductTaxCategory(item: TaxableItemDto): Promise<TaxCategory | null> {
    // This would typically look up the product's tax category
    // For now, return a default category
    return await this.taxCategoryRepository.findOne({
      where: { code: 'GENERAL', isActive: true },
    });
  }

  private isRateApplicableToItem(rate: TaxRate, item: TaxableItemDto, category: TaxCategory | null): boolean {
    // Check if rate is applicable based on product characteristics
    if (item.isDigital && rate.type === TaxType.DIGITAL_TAX) return true;
    if (item.isService && rate.type === TaxType.VAT) return true;
    
    // Check category-based applicability
    if (category && category.isExempt) return false;
    
    return true;
  }

  async getCustomerExemptions(customerId?: string, certificateNumber?: string): Promise<TaxExemption[]> {
    if (!customerId && !certificateNumber) return [];

    const query = this.taxExemptionRepository.createQueryBuilder('exemption')
      .where('exemption.status = :status', { status: ExemptionStatus.APPROVED })
      .andWhere('exemption.isActive = :isActive', { isActive: true })
      .andWhere('exemption.validFrom <= :now', { now: new Date() })
      .andWhere('(exemption.validTo IS NULL OR exemption.validTo >= :now)', { now: new Date() });

    if (customerId) {
      query.andWhere('exemption.customerId = :customerId', { customerId });
    }

    if (certificateNumber) {
      query.andWhere('exemption.certificateNumber = :certificateNumber', { certificateNumber });
    }

    return await query.getMany();
  }

  async applyTaxRules(totalTax: number, rules: TaxRule[], data: CalculateTaxDto): Promise<number> {
    let adjustedTax = totalTax;

    for (const rule of rules) {
      for (const action of rule.actions) {
        switch (action.action) {
          case 'SET_TAX_RATE':
            adjustedTax = data.subtotal * action.value;
            break;
          case 'ADD_TAX_AMOUNT':
            adjustedTax += action.value;
            break;
          case 'SUBTRACT_TAX_AMOUNT':
            adjustedTax -= action.value;
            break;
          case 'MULTIPLY_TAX':
            adjustedTax *= action.value;
            break;
          case 'SET_MAX_TAX':
            adjustedTax = Math.min(adjustedTax, action.value);
            break;
          case 'SET_MIN_TAX':
            adjustedTax = Math.max(adjustedTax, action.value);
            break;
        }
      }
    }

    return Math.max(0, adjustedTax);
  }

  async createTaxRate(rateData: Partial<TaxRate>): Promise<TaxRate> {
    const rate = this.taxRateRepository.create(rateData);
    return await this.taxRateRepository.save(rate);
  }

  async updateTaxRate(id: string, updateData: Partial<TaxRate>): Promise<TaxRate> {
    const rate = await this.taxRateRepository.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Tax rate with ID ${id} not found`);
    }

    Object.assign(rate, updateData);
    return await this.taxRateRepository.save(rate);
  }

  async deleteTaxRate(id: string): Promise<void> {
    const rate = await this.taxRateRepository.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Tax rate with ID ${id} not found`);
    }

    await this.taxRateRepository.remove(rate);
  }

  async getAllTaxRates(): Promise<TaxRate[]> {
    return await this.taxRateRepository.find({
      where: { isActive: true },
      order: { country: 'ASC', state: 'ASC', rate: 'DESC' },
    });
  }

  async getTaxRateById(id: string): Promise<TaxRate> {
    const rate = await this.taxRateRepository.findOne({ where: { id } });
    if (!rate) {
      throw new NotFoundException(`Tax rate with ID ${id} not found`);
    }

    return rate;
  }

  async createTaxRule(ruleData: Partial<TaxRule>): Promise<TaxRule> {
    const rule = this.taxRuleRepository.create(ruleData);
    return await this.taxRuleRepository.save(rule);
  }

  async updateTaxRule(id: string, updateData: Partial<TaxRule>): Promise<TaxRule> {
    const rule = await this.taxRuleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Tax rule with ID ${id} not found`);
    }

    Object.assign(rule, updateData);
    return await this.taxRuleRepository.save(rule);
  }

  async deleteTaxRule(id: string): Promise<void> {
    const rule = await this.taxRuleRepository.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException(`Tax rule with ID ${id} not found`);
    }

    await this.taxRuleRepository.remove(rule);
  }

  async getAllTaxRules(): Promise<TaxRule[]> {
    return await this.taxRuleRepository.find({
      where: { isActive: true },
      order: { priority: 'DESC', name: 'ASC' },
    });
  }

  async createTaxCategory(categoryData: Partial<TaxCategory>): Promise<TaxCategory> {
    const category = this.taxCategoryRepository.create(categoryData);
    return await this.taxCategoryRepository.save(category);
  }

  async updateTaxCategory(id: string, updateData: Partial<TaxCategory>): Promise<TaxCategory> {
    const category = await this.taxCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Tax category with ID ${id} not found`);
    }

    Object.assign(category, updateData);
    return await this.taxCategoryRepository.save(category);
  }

  async deleteTaxCategory(id: string): Promise<void> {
    const category = await this.taxCategoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Tax category with ID ${id} not found`);
    }

    await this.taxCategoryRepository.remove(category);
  }

  async getAllTaxCategories(): Promise<TaxCategory[]> {
    return await this.taxCategoryRepository.find({
      where: { isActive: true },
      order: { priority: 'ASC', name: 'ASC' },
    });
  }

  async createTaxExemption(exemptionData: Partial<TaxExemption>): Promise<TaxExemption> {
    const exemption = this.taxExemptionRepository.create(exemptionData);
    return await this.taxExemptionRepository.save(exemption);
  }

  async updateTaxExemption(id: string, updateData: Partial<TaxExemption>): Promise<TaxExemption> {
    const exemption = await this.taxExemptionRepository.findOne({ where: { id } });
    if (!exemption) {
      throw new NotFoundException(`Tax exemption with ID ${id} not found`);
    }

    Object.assign(exemption, updateData);
    return await this.taxExemptionRepository.save(exemption);
  }

  async approveTaxExemption(id: string, approvedBy: string): Promise<TaxExemption> {
    const exemption = await this.taxExemptionRepository.findOne({ where: { id } });
    if (!exemption) {
      throw new NotFoundException(`Tax exemption with ID ${id} not found`);
    }

    exemption.status = ExemptionStatus.APPROVED;
    exemption.approvedBy = approvedBy;
    exemption.approvedAt = new Date();

    return await this.taxExemptionRepository.save(exemption);
  }

  async rejectTaxExemption(id: string, rejectionReason: string): Promise<TaxExemption> {
    const exemption = await this.taxExemptionRepository.findOne({ where: { id } });
    if (!exemption) {
      throw new NotFoundException(`Tax exemption with ID ${id} not found`);
    }

    exemption.status = ExemptionStatus.REJECTED;
    exemption.rejectionReason = rejectionReason;

    return await this.taxExemptionRepository.save(exemption);
  }

  async getTaxAnalytics(): Promise<any> {
    const [totalRates, totalRules, totalCategories, totalExemptions] = await Promise.all([
      this.taxRateRepository.count({ where: { isActive: true } }),
      this.taxRuleRepository.count({ where: { isActive: true } }),
      this.taxCategoryRepository.count({ where: { isActive: true } }),
      this.taxExemptionRepository.count({ where: { isActive: true } }),
    ]);

    const pendingExemptions = await this.taxExemptionRepository.count({
      where: { status: ExemptionStatus.PENDING },
    });

    const expiringExemptions = await this.taxExemptionRepository.count({
      where: {
        validTo: Between(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Next 30 days
        status: ExemptionStatus.APPROVED,
      },
    });

    return {
      totalRates,
      totalRules,
      totalCategories,
      totalExemptions,
      pendingExemptions,
      expiringExemptions,
      taxTypes: Object.values(TaxType),
      ruleTypes: Object.values(RuleType),
      categoryTypes: Object.values(TaxCategoryType),
    };
  }
} 