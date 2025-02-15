import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { WooCommerceConfig } from 'src/config/wooCommerce';
import { UsersRepository } from 'src/users/users.repository';
import { Users } from 'src/entities/users.entity';
import { WooCommerceService } from 'src/wooApi/wooApi.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, UsersRepository, WooCommerceConfig, WooCommerceService],
  imports: [TypeOrmModule.forFeature([Products, Users])],
})
export class ProductsModule {}
