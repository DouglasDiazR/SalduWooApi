import { Body, Controller, Get, HttpCode, UseGuards } from '@nestjs/common'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import { AuthGuard } from 'src/guards/auth.guard'
import { UsersRepository } from 'src/users/users.repository'
import { WooCommerceService } from 'src/wooApi/wooApi.service'

@Controller('woo-commerce')
export class WooCommerceController {
    constructor(
        private readonly wooCommerceService: WooCommerceService,
        private readonly usersRepository: UsersRepository,
    ) {}

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

    @Get('products')
    async getProducts() {
        return this.wooCommerceService.getProducts()
    }
}
