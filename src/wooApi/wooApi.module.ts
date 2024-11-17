import { Module } from '@nestjs/common'
import { WooCommerceController } from './wooApi.controller'
import { WooCommerceService } from './wooApi.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entitys/users.entity'
import { WooCommerceConfig } from 'src/config/wooCommerce'
import { Products } from 'src/entitys/products.entity'
import { UsersRepository } from 'src/users/users.repository'

@Module({
    imports: [TypeOrmModule.forFeature([Users, Products])],
    controllers: [WooCommerceController],
    providers: [WooCommerceService, WooCommerceConfig, UsersRepository],
    exports: [WooCommerceService],
})
export class WooApiModule {}
