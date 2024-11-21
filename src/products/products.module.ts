import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsRepository } from './products.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { WooCommerceConfig } from 'src/config/wooCommerce';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsRepository, WooCommerceConfig],
  imports: [TypeOrmModule.forFeature([Products])],
})
export class ProductsModule {}
