import { Module } from '@nestjs/common'
import { WooCommerceController } from './wooApi.controller'
import { WooCommerceService } from './wooApi.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customers } from 'src/entitys/customers.entity'
import { WooCommerceConfig } from 'src/config/wooCommerce'
import { Products } from 'src/entitys/products.entity'
import { UsersRepository } from 'src/users/users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Customers, Products])],
    controllers: [WooCommerceController],
    providers: [WooCommerceService, WooCommerceConfig, UsersRepository],
    exports: [WooCommerceService],
})
export class WooApiModule {}
