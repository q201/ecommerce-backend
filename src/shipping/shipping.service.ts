import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingMethod, ShippingMethodType, ShippingProvider } from './entities/shipping-method.entity';
import { ShippingZone } from './entities/shipping-zone.entity';
import { DeliverySlot, DeliverySlotType, DayOfWeek } from './entities/delivery-slot.entity';
import { ShippingRate } from './entities/shipping-rate.entity';
import { CalculateShippingDto, AddressDto, CartItemDto } from './dtos/calculate-shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectRepository(ShippingMethod)
    private shippingMethodRepository: Repository<ShippingMethod>,
    @InjectRepository(ShippingZone)
    private shippingZoneRepository: Repository<ShippingZone>,
    @InjectRepository(DeliverySlot)
    private deliverySlotRepository: Repository<DeliverySlot>,
    @InjectRepository(ShippingRate)
    private shippingRateRepository: Repository<ShippingRate>,
  ) {}

  async calculateShipping(calculateShippingDto: CalculateShippingDto): Promise<any> {
    const { address, items, orderTotal } = calculateShippingDto;

    // Calculate total weight and value
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 0) * item.quantity, 0);
    const totalValue = orderTotal || items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Find applicable shipping zone
    const shippingZone = await this.findShippingZone(address);
    if (!shippingZone) {
      throw new BadRequestException('No shipping zone found for the provided address');
    }

    // Get available shipping methods
    const availableMethods = await this.getAvailableShippingMethods(shippingZone.id, totalWeight, totalValue);

    // Calculate rates for each method
    const shippingOptions = await Promise.all(
      availableMethods.map(async (method) => {
        const rate = await this.calculateShippingRate(method.id, shippingZone.id, totalWeight, totalValue);
        return {
          methodId: method.id,
          methodName: method.name,
          methodCode: method.code,
          methodType: method.type,
          provider: method.provider,
          cost: rate.cost,
          estimatedDays: rate.estimatedDays,
          isFree: rate.isFree,
          requiresTracking: method.requiresTracking,
          requiresSignature: method.requiresSignature,
          isExpress: method.isExpress,
        };
      })
    );

    // Sort by cost (lowest first)
    shippingOptions.sort((a, b) => a.cost - b.cost);

    return {
      shippingZone: {
        id: shippingZone.id,
        name: shippingZone.name,
        estimatedDeliveryDays: shippingZone.estimatedDeliveryDays,
      },
      totalWeight,
      totalValue,
      shippingOptions,
    };
  }

  async findShippingZone(address: AddressDto): Promise<ShippingZone> {
    const zones = await this.shippingZoneRepository.find({
      where: { isActive: true },
    });

    for (const zone of zones) {
      if (this.isAddressInZone(address, zone)) {
        return zone;
      }
    }

    return null;
  }

  private isAddressInZone(address: AddressDto, zone: ShippingZone): boolean {
    // Check country
    if (!zone.countries.includes(address.country)) {
      return false;
    }

    // Check state if specified
    if (zone.states && zone.states.length > 0 && !zone.states.includes(address.state)) {
      return false;
    }

    // Check city if specified
    if (zone.cities && zone.cities.length > 0 && !zone.cities.includes(address.city)) {
      return false;
    }

    // Check postal code if specified
    if (zone.postalCodes && zone.postalCodes.length > 0) {
      const postalCodeMatch = zone.postalCodes.some(pattern => {
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(address.postalCode);
        }
        return pattern === address.postalCode;
      });
      if (!postalCodeMatch) {
        return false;
      }
    }

    return true;
  }

  async getAvailableShippingMethods(
    zoneId: string,
    totalWeight: number,
    totalValue: number
  ): Promise<ShippingMethod[]> {
    return await this.shippingMethodRepository.find({
      where: { isActive: true },
    });
  }

  async calculateShippingRate(
    methodId: string,
    zoneId: string,
    totalWeight: number,
    totalValue: number
  ): Promise<{ cost: number; estimatedDays: number; isFree: boolean }> {
    const method = await this.shippingMethodRepository.findOne({
      where: { id: methodId },
    });

    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${methodId} not found`);
    }

    // Check if free shipping applies
    if (method.type === ShippingMethodType.FREE_SHIPPING || totalValue >= method.minOrderAmount) {
      return {
        cost: 0,
        estimatedDays: method.maxDeliveryDays,
        isFree: true,
      };
    }

    // Get applicable rate
    const rate = await this.shippingRateRepository.findOne({
      where: {
        shippingMethodId: methodId,
        zoneId,
        isActive: true,
      },
    });

    if (!rate) {
      throw new BadRequestException('No shipping rate found for the specified method and zone');
    }

    let cost = rate.rate;

    // Apply weight-based pricing
    if (method.type === ShippingMethodType.WEIGHT_BASED) {
      const weightCost = this.calculateWeightBasedCost(totalWeight, method);
      cost = Math.max(cost, weightCost);
    }

    // Apply price-based pricing
    if (method.type === ShippingMethodType.PRICE_BASED) {
      const priceCost = this.calculatePriceBasedCost(totalValue, method);
      cost = Math.max(cost, priceCost);
    }

    // Add handling fee
    cost += method.handlingFee;

    // Add additional fees
    cost += rate.additionalFee;

    return {
      cost,
      estimatedDays: rate.maxDeliveryDays || method.maxDeliveryDays,
      isFree: false,
    };
  }

  private calculateWeightBasedCost(weight: number, method: ShippingMethod): number {
    // Simple weight-based calculation
    if (weight <= method.minWeight) {
      return method.baseCost;
    }
    
    const additionalWeight = weight - method.minWeight;
    const additionalCost = additionalWeight * 2; // $2 per kg
    return method.baseCost + additionalCost;
  }

  private calculatePriceBasedCost(value: number, method: ShippingMethod): number {
    // Simple price-based calculation
    if (value <= method.minOrderAmount) {
      return method.baseCost;
    }
    
    const additionalValue = value - method.minOrderAmount;
    const additionalCost = additionalValue * 0.05; // 5% of additional value
    return method.baseCost + additionalCost;
  }

  async getDeliverySlots(date: string, methodId?: string): Promise<DeliverySlot[]> {
    const targetDate = new Date(date);
    const dayOfWeek = this.getDayOfWeek(targetDate);

    const query = this.deliverySlotRepository.createQueryBuilder('slot')
      .where('slot.dayOfWeek = :dayOfWeek', { dayOfWeek })
      .andWhere('slot.isActive = :isActive', { isActive: true });

    if (methodId) {
      // Add method-specific filtering if needed
    }

    return await query
      .orderBy('slot.startTime', 'ASC')
      .getMany();
  }

  private getDayOfWeek(date: Date): DayOfWeek {
    const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
    return days[date.getDay()] as DayOfWeek;
  }

  async createShippingMethod(methodData: Partial<ShippingMethod>): Promise<ShippingMethod> {
    const method = this.shippingMethodRepository.create(methodData);
    return await this.shippingMethodRepository.save(method);
  }

  async updateShippingMethod(id: string, updateData: Partial<ShippingMethod>): Promise<ShippingMethod> {
    const method = await this.shippingMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${id} not found`);
    }

    Object.assign(method, updateData);
    return await this.shippingMethodRepository.save(method);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    const method = await this.shippingMethodRepository.findOne({ where: { id } });
    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${id} not found`);
    }

    await this.shippingMethodRepository.remove(method);
  }

  async getAllShippingMethods(): Promise<ShippingMethod[]> {
    return await this.shippingMethodRepository.find({
      where: { isActive: true },
      relations: ['rates'],
      order: { name: 'ASC' },
    });
  }

  async getShippingMethodById(id: string): Promise<ShippingMethod> {
    const method = await this.shippingMethodRepository.findOne({
      where: { id },
      relations: ['rates'],
    });

    if (!method) {
      throw new NotFoundException(`Shipping method with ID ${id} not found`);
    }

    return method;
  }

  async createShippingZone(zoneData: Partial<ShippingZone>): Promise<ShippingZone> {
    const zone = this.shippingZoneRepository.create(zoneData);
    return await this.shippingZoneRepository.save(zone);
  }

  async updateShippingZone(id: string, updateData: Partial<ShippingZone>): Promise<ShippingZone> {
    const zone = await this.shippingZoneRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Shipping zone with ID ${id} not found`);
    }

    Object.assign(zone, updateData);
    return await this.shippingZoneRepository.save(zone);
  }

  async deleteShippingZone(id: string): Promise<void> {
    const zone = await this.shippingZoneRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Shipping zone with ID ${id} not found`);
    }

    await this.shippingZoneRepository.remove(zone);
  }

  async getAllShippingZones(): Promise<ShippingZone[]> {
    return await this.shippingZoneRepository.find({
      where: { isActive: true },
      order: { name: 'ASC' },
    });
  }

  async getShippingZoneById(id: string): Promise<ShippingZone> {
    const zone = await this.shippingZoneRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Shipping zone with ID ${id} not found`);
    }

    return zone;
  }

  async getShippingAnalytics(): Promise<any> {
    const [methods, zones] = await Promise.all([
      this.shippingMethodRepository.count({ where: { isActive: true } }),
      this.shippingZoneRepository.count({ where: { isActive: true } }),
    ]);

    return {
      totalMethods: methods,
      totalZones: zones,
      popularMethods: await this.getPopularShippingMethods(),
    };
  }

  private async getPopularShippingMethods(): Promise<any[]> {
    // This would typically query order data to find most used shipping methods
    return await this.shippingMethodRepository
      .createQueryBuilder('method')
      .select('method.name', 'name')
      .addSelect('method.type', 'type')
      .addSelect('method.provider', 'provider')
      .where('method.isActive = :isActive', { isActive: true })
      .orderBy('method.name', 'ASC')
      .limit(5)
      .getRawMany();
  }
} 