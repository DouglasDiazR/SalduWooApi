import {
    Controller,
    Get,
    HttpCode,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import { Request } from 'express'

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrders(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return await this.ordersService.getOrders({ startDate, endDate })
    }

    @Get('byProduct')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrdersByProduct(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('idProduct') idProduct?: number,
    ) {
        return await this.ordersService.getOrdersByProduct({
            startDate,
            endDate,
            idProduct,
        })
    }

    @Get('ordersUser')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getOrdersUser(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
        @Query('idProduct') idProduct: number,
        @Req() req: Request,
    ) {
        const idWooUser = req.user.id_wooCommerce
        return await this.ordersService.getOrdersUser(
            { startDate, endDate, idProduct },
            idWooUser,
        )
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrderById(@Param('id') id: number) {
        return await this.ordersService.getOrderById(id)
    }
}
