import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReturnsController } from './returns.controller';
import { ReturnsService } from './returns.service';
import { Return } from './entities/return.entity';
import { ReturnItem } from './entities/return-item.entity';
import { Refund } from './entities/refund.entity';
import { ReturnReason } from './entities/return-reason.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Return, ReturnItem, Refund, ReturnReason])],
  controllers: [ReturnsController],
  providers: [ReturnsService],
  exports: [ReturnsService],
})
export class ReturnsModule {} 