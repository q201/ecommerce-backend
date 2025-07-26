import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { SalesReport } from './entities/sales-report.entity';
import { UserAnalytics } from './entities/user-analytics.entity';
import { ProductAnalytics } from './entities/product-analytics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SalesReport, UserAnalytics, ProductAnalytics])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 