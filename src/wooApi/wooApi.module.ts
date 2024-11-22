import { Module } from '@nestjs/common'
import { WooCommerceController } from './wooApi.controller'
import { WooCommerceService } from './wooApi.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WooCommerceConfig } from 'src/config/wooCommerce'
import { Products } from 'src/entities/products.entity'
import { Users } from 'src/entities/users.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Users, Products])],
    controllers: [WooCommerceController],
    providers: [WooCommerceService, WooCommerceConfig],
    exports: [WooCommerceService],
})
export class WooApiModule {}
