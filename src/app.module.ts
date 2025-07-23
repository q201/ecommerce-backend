import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { CustomerModule } from './customer/customer.module';
import { PaymentModule } from './payment/payment.module';
import { FulfillmentModule } from './fulfillment/fulfillment.module';
import { DiscountModule } from './discount/discount.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '54321',
      database: 'ecommerce_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    ProductsModule,
    UsersModule,
    OrdersModule,
    AuthModule,
    CartModule,
    CustomerModule,
    PaymentModule,
    FulfillmentModule,
    DiscountModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
