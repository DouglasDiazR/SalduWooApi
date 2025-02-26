import { Module } from '@nestjs/common'
import { OrdersController } from './orders.controller'
import { OrdersService } from './orders.service'
import { WooCommerceConfig } from 'src/config/wooCommerce'
import { Order } from 'src/entities/order.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { S3Service } from './s3.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, WooCommerceConfig, S3Service],
    imports: [TypeOrmModule.forFeature([Order])]
})
export class OrdersModule {}
