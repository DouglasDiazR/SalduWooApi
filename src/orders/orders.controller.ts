import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import { query, Request } from 'express'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async getOrders() {
        return await this.ordersService.getOrders()
    }

    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    @Get('ordersUser')
    async getOrdersUser(@Req() req: Request) {
        const idWooUser = req.user.id_wooCommerce
        console.log('id_wooUser', idWooUser)
        return await this.ordersService.getOrdersUser(idWooUser)
    }
}
