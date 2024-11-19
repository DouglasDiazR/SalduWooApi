import { Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { Roles } from 'src/decorators/roles.decorator'
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
}
