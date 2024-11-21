import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'

@Injectable()
export class OrdersService {
    constructor(private readonly WooCommerce: WooCommerceRestApi) {}

    async getOrders({
        startDate,
        endDate,
    }: {
        startDate?: string
        endDate?: string
    }) {
        const perPage = 100
        let page = 1
        let allOrders = []

        try {
            while (true) {
                const response = await this.WooCommerce.get('orders', {
                    page,
                    per_page: perPage,
                    after: startDate,
                    before: endDate,
                })

                if (response.data.length === 0) break

                const formattOrder = response.data.map((order) => ({
                    order_id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
                    products: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
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

    async getOrdersByProduct({
        startDate,
        endDate,
        idProduct,
    }: {
        startDate?: string
        endDate?: string
        idProduct?: number
    }) {
        console.log(idProduct)
        const perPage = 100
        let page = 1
        let allOrders = []

        try {
            while (true) {
                const response = await this.WooCommerce.get('orders', {
                    page,
                    per_page: perPage,
                    after: startDate,
                    before: endDate,
                    product: idProduct,
                })

                if (response.data.length === 0) break

                const formattOrder = response.data.map((order) => ({
                    order_id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
                    products: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
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

    async getOrdersUser(
        {
            startDate,
            endDate,
            idProduct,
        }: { startDate?: string; endDate?: string; idProduct?: number },
        idWooUser: number,
    ) {
        console.log('startDate: ', startDate)
        console.log(idWooUser)
        console.log('idProduct', idProduct)
        const perPage = 100
        let page = 1
        let allOrdersUser = []
        try {
            while (true) {
                const orders = await this.WooCommerce.get('orders', {
                    page,
                    per_page: perPage,
                    customer: idWooUser,
                    product: idProduct,
                    after: startDate,
                    before: endDate,
                })

                if (orders.data.length === 0) break

                const formattOrder = orders.data.map((order) => ({
                    order_id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
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

    async getOrderById(id: number) {
        try {
            const response = await this.WooCommerce.get(`orders/${id}`)

            if (!response || !response.data) {
                throw new NotFoundException(
                    `La orden con ID ${id} no fue encontrada.`,
                )
            }

            const order = response.data

            const formattedOrder = {
                order_id: order.id,
                number: order.number,
                status: order.status,
                total: order.total,
                date_created: order.date_created,
                date_modified: order.date_modified,
                customer_id: order.customer_id,
                date_paid: order.date_paid,
                products: Array.isArray(order.line_items)
                    ? order.line_items.map((item) => ({
                          product_id: item.product_id,
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price,
                          total: item.total,
                      }))
                    : [],
            }

            return formattedOrder
        } catch (error) {
            console.error(`Error al obtener la orden con ID ${id}:`, error)
            throw new InternalServerErrorException(
                `Hubo un error al obtener la orden con ID ${id}. Por favor, intente nuevamente.`,
            )
        }
    }
}
