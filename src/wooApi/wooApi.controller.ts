import {
    Controller,
    Get,
    HttpCode,
    Param,
    Req,
    UseGuards,
} from '@nestjs/common'
import { Request } from 'express'
import { Roles } from 'src/decorators/roles.decorator'
import { Users } from 'src/entities/users.entity'
import { Role } from 'src/enum/role.enum'
import { AuthGuard } from 'src/guards/auth.guard'
import { WooCommerceService } from 'src/wooApi/wooApi.service'

@Controller('woo-commerce')
export class WooCommerceController {
    constructor(private readonly wooCommerceService: WooCommerceService) {}

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getApiEndpoints() {
        return this.wooCommerceService.getApiEndpoints()
    }

    @Get('customers')
    async getUsers() {
        return await this.wooCommerceService.getUsers()
    }

    @Get('products')
    async getProducts() {
        return await this.wooCommerceService.getProducts()
    }

    @Get('orders')
    async getOrders() {
        return await this.wooCommerceService.getOrders()
    }

    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    @Get('ordersUser')
    async getOrdersUser(@Req() req: Request) {
        const idWooUser = req.user.id_wooCommerce
        return await this.wooCommerceService.getOrdersUser(idWooUser)
    }
}
