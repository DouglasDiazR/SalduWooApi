import { Injectable } from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { WOOAPI_KEY, WOOAPI_SECRET, WOOAPI_URL } from 'src/config/envs'

@Injectable()
export class WooCommerceService {
    private WooCommerce: WooCommerceRestApi

    constructor() {
        this.WooCommerce = new WooCommerceRestApi({
            url: WOOAPI_URL,
            consumerKey: WOOAPI_KEY,
            consumerSecret: WOOAPI_SECRET,
            version: 'wc/v3',
        })
    }

    async getApiEndpoints() {
        try {
            const response = await this.WooCommerce.get('')
            return response.data
        } catch (error) {
            console.error(
                'Error al obtener los puntos finales:',
                error.response?.data || error.message,
            )
            throw error
        }
    }
}
