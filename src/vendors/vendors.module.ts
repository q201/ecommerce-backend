import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VendorsController } from './vendors.controller';
import { VendorsService } from './vendors.service';
import { Vendor } from './entities/vendor.entity';
import { VendorProduct } from './entities/vendor-product.entity';
import { VendorCommission } from './entities/vendor-commission.entity';
import { VendorPayout } from './entities/vendor-payout.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, VendorProduct, VendorCommission, VendorPayout])],
  controllers: [VendorsController],
  providers: [VendorsService],
  exports: [VendorsService],
})
export class VendorsModule {} 