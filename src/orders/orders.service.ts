import { Injectable, InternalServerErrorException } from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

@Injectable()
export class OrdersService {
    constructor(private readonly WooCommerce: WooCommerceRestApi) {}

    async getOrders() {
        const perPage = 100
        let page = 1
        let allOrders = []

        try {
            while (true) {
                const response = await this.WooCommerce.get('orders', {
                    page,
                    per_page: perPage,
                })

                if (response.data.length === 0) break

                const formattOrder = response.data.map((order) => ({
                    idOrder: order.id,
                    dateCreated: order.date_created,
                    products: order.line_items.map((item) => {
                        console.log(JSON.stringify(item.meta_data, null, 2))
                        return {
                            productId: item.product_id,
                            productName: item.name,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.total,
                            vendorId: item.meta_data.find(
                                (meta) => meta.key === 'vendor_id',
                            )?.value,
                        }
                    }),
                }))

                allOrders = allOrders.concat(formattOrder)

                page += 1

                return allOrders
            }
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes. Por favor, intente nuevamente.',
            )
        }
    }

    async getOrdersUser(idWooUser: number) {
        console.log(idWooUser)
        const perPage = 100
        let page = 1
        let allOrdersUser = []
        try {
            while (true) {
                const orders = await this.WooCommerce.get('orders', {
                    page,
                    per_page: perPage,
                    customer: idWooUser,
                })

                if (orders.data.length === 0) break

                const formattOrder = orders.data.map((order) => ({
                    idOrder: order.id,
                    statusOrder: order.status,
                    totalOrder: order.total,
                    date_createdOrder: order.date_created,
                    products: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
                }))

                allOrdersUser = allOrdersUser.concat(formattOrder)

                page += 1
            }
            return allOrdersUser
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes. Por favor, intente nuevamente.',
            )
        }
    }
}
