import { Controller, Get } from '@nestjs/common'
import { WooCommerceService } from 'src/wooApi/wooApi.service'

@Controller('woo-commerce')
export class WooCommerceController {
    constructor(private readonly wooCommerceService: WooCommerceService) {}

    @Get()
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
