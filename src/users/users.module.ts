import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { Review } from '../products/entities/review.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Review])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
