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

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('admin')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrdersForAdmin(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return await this.ordersService.getAllOrders({
            startDate,
            endDate,
        })
    }

    @Get('admin/product')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrdersByProduct(
        @Query('productId') productId: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        return await this.ordersService.getOrdersByProduct({
            productId,
            startDate,
            endDate,
        })
    }

    @Get('seller')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getOrdersForSeller(
        @Req() request: Express.Request,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user
        return await this.ordersService.getAllOrdersForSeller({
            startDate,
            endDate,
            vendorId,
        })
    }

    @Get('seller/product')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getOrdersForProduct(
        @Req() request: Express.Request,
        @Query('productId') productId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user
        return await this.ordersService.getOrdersSellerByProduct({
            productId,
            startDate,
            endDate,
            vendorId,
        })
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrderById(@Param('id') id: number) {
        return await this.ordersService.getOrderById(id)
    }
}
