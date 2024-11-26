import { Injectable } from '@nestjs/common'
import { WooCommerceService } from './wooApi/wooApi.service'

@Injectable()
export class AppService {
    constructor(private readonly wooCommerceService: WooCommerceService) {}
    async onApplicationBootstrap() {
        await this.wooCommerceService.getUsers()
        /*  await this.wooCommerceService.getProducts() */
    }
}
