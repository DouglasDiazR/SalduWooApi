import { Controller, Get } from '@nestjs/common'
import { WooCommerceService } from 'src/wooApi/wooApi.service'

@Controller('woo-commerce')
export class WooCommerceController {
    constructor(private readonly wooCommerceService: WooCommerceService) {}

    @Get('endpoints')
    async getApiEndpoints() {
        return this.wooCommerceService.getApiEndpoints()
    }
}
