import { Module } from '@nestjs/common'
import { WooCommerceController } from './wooApi.controller'
import { WooCommerceService } from './wooApi.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Customers } from 'src/entitys/customers.entity'
import { WooCommerceConfig } from 'src/config/wooCommerce'

@Module({
    imports: [TypeOrmModule.forFeature([Customers])],
    controllers: [WooCommerceController],
    providers: [WooCommerceService, WooCommerceConfig],
    exports: [WooCommerceService],
})
export class WooApiModule {}
