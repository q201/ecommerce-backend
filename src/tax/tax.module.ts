import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';
import { TaxRate } from './entities/tax-rate.entity';
import { TaxRule } from './entities/tax-rule.entity';
import { TaxCategory } from './entities/tax-category.entity';
import { TaxExemption } from './entities/tax-exemption.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaxRate, TaxRule, TaxCategory, TaxExemption])],
  controllers: [TaxController],
  providers: [TaxService],
  exports: [TaxService],
})
export class TaxModule {} 