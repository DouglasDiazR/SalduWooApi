import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import IOrders from './orders.interface'

@Injectable()
export class OrdersService {
    constructor(private readonly WooCommerce: WooCommerceRestApi) {}

    async getOrders({
        startDate,
        endDate,
    }: {
        startDate?: string
        endDate?: string
    }): Promise<IOrders[]> {
        const perPage = 100
        let page = 1
        let allOrders: IOrders[] = []

        try {
            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page,
                        per_page: perPage,
                        after: startDate,
                        before: endDate,
                    },
                )

                if (orders.data.length === 0) break

                const formattOrder = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
                }))
                allOrders = [...allOrders, ...formattOrder]
                page += 1

                if (allOrders.length === 0)
                    throw new NotFoundException('No se encontraron órdenes.')

                return allOrders
            }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes. Por favor, intente nuevamente..',
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
    }): Promise<IOrders[]> {
        const perPage = 100
        let page = 1
        let allOrders: IOrders[] = []

        try {
            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page,
                        per_page: perPage,
                        after: startDate,
                        before: endDate,
                        product: idProduct,
                    },
                )

                if (orders.data.length === 0) break

                const formattOrder = orders.data.map((order: IOrders) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                    })),
                }))

                allOrders = [...allOrders, ...formattOrder]

                page += 1

                if (allOrders.length === 0)
                    throw new NotFoundException(
                        'No se encontraron órdenes asociadas al producto.',
                    )

                return allOrders
            }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
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
    ): Promise<IOrders[]> {
        const perPage = 100
        let page = 1
        let allOrdersUser: IOrders[] = []
        try {
            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page,
                        per_page: perPage,
                        customer: idWooUser,
                        product: idProduct,
                        after: startDate,
                        before: endDate,
                    },
                )

                if (orders.data.length === 0) break

                const formattOrder: IOrders[] = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    customer_id: order.customer_id,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                    })),
                }))
                allOrdersUser = [...allOrdersUser, ...formattOrder]

                page += 1
            }
            if (allOrdersUser.length === 0)
                throw new NotFoundException(
                    'No se encontraron órdenes asociadas al vendedor.',
                )

            return allOrdersUser
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes. Por favor, intente nuevamente.',
            )
        }
    }

    async getOrderById(id: number): Promise<IOrders | string> {
        try {
            const response: { data: IOrders } = await this.WooCommerce.get(
                `orders/${id}`,
            )

            if (!response || !response.data) {
                throw new NotFoundException(
                    `La orden con ID ${id} no fue encontrada.`,
                )
            }

            const order = response.data

            const formattedOrder: IOrders = {
                id: order.id,
                number: order.number,
                status: order.status,
                total: order.total,
                date_created: order.date_created,
                date_modified: order.date_modified,
                customer_id: order.customer_id,
                date_paid: order.date_paid,
                line_items: Array.isArray(order.line_items)
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
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener la orden. Por favor, intente nuevamente.',
            )
        }
    }
}
