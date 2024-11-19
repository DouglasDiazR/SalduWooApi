import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { WooCommerceConfig } from 'src/config/wooCommerce'

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, WooCommerceConfig],
})
export class OrdersModule {}
