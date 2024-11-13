import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { WOOAPI_KEY, WOOAPI_SECRET, WOOAPI_URL } from './envs'

export const WooCommerceConfig = {
    provide: WooCommerceRestApi,
    useValue: new WooCommerceRestApi({
        url: WOOAPI_URL,
        consumerKey: WOOAPI_KEY,
        consumerSecret: WOOAPI_SECRET,
        version: 'wc/v3',
    }),
}
