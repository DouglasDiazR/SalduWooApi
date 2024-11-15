import { Body, Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
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
    async getCustomers() {
        return this.wooCommerceService.getCustomers()
    }

 login
    @Get('customers/email')
    async getCustomerByEmail(@Body('email') email: string) {
        return await this.wooCommerceService.getCustomerByEmail(email)
    }
     
    @Get('products')
    async getProducts() {
        return this.wooCommerceService.getProducts()

    }
}
