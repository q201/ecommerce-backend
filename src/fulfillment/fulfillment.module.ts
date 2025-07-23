import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FulfillmentService } from './fulfillment.service';
import { FulfillmentController } from './fulfillment.controller';
import { Fulfillment } from './entities/fulfillment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Fulfillment])],
  providers: [FulfillmentService],
  controllers: [FulfillmentController],
  exports: [FulfillmentService],
})
export class FulfillmentModule {}
