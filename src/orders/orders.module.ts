import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { WooCommerceConfig } from 'src/config/wooCommerce'
import { Order } from 'src/entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, WooCommerceConfig],
    imports: [TypeOrmModule.forFeature([Order])]
})
export class OrdersModule {}
