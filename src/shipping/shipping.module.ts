import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShippingController } from './shipping.controller';
import { ShippingService } from './shipping.service';
import { ShippingMethod } from './entities/shipping-method.entity';
import { ShippingZone } from './entities/shipping-zone.entity';
import { DeliverySlot } from './entities/delivery-slot.entity';
import { ShippingRate } from './entities/shipping-rate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShippingMethod, ShippingZone, DeliverySlot, ShippingRate])],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {} 