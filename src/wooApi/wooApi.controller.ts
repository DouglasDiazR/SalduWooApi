import { Controller } from '@nestjs/common'
import { WooCommerceService } from 'src/wooApi/wooApi.service'

@Controller('woo-commerce')
export class WooCommerceController {
    constructor(private readonly wooCommerceService: WooCommerceService) {}
}
