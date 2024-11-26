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

    async getAllOrders({
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

                const formattedOrders = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data || [],
                    })),
                }))

                allOrders = [...allOrders, ...formattedOrders]
                page += 1
            }

            if (allOrders.length === 0) {
                throw new NotFoundException('No se encontraron órdenes.')
            }

            return allOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes del administrador.',
            )
        }
    }

    async getOrdersByProduct({
        productId,
        startDate,
        endDate,
    }: {
        productId: number
        startDate?: string
        endDate?: string
    }): Promise<IOrders[]> {
        const perPage = 100
        let page = 1
        let filteredOrders: IOrders[] = []

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

                const formattedOrders = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data || [],
                    })),
                }))

                const ordersWithProduct = formattedOrders.filter((order) =>
                    order.line_items.some(
                        (item) => item.product_id === productId,
                    ),
                )

                filteredOrders = [...filteredOrders, ...ordersWithProduct]
                page += 1
            }

            if (filteredOrders.length === 0) {
                throw new NotFoundException(
                    `No se encontraron órdenes con el producto ID: ${productId}.`,
                )
            }

            return filteredOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes con el producto especificado.',
            )
        }
    }

    async getAllOrdersForSeller({
        startDate,
        endDate,
        vendorId,
    }: {
        startDate?: string
        endDate?: string
        vendorId: number
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

                const formattedOrders = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data || [],
                    })),
                }))

                allOrders = [...allOrders, ...formattedOrders]
                page += 1
            }

            // Filtrar las órdenes para incluir solo los productos del vendedor
            allOrders = allOrders
                .map((order) => ({
                    ...order,
                    line_items: order.line_items.filter((item) =>
                        item.meta_data.some(
                            (product) =>
                                product.key === 'vendedor' &&
                                product.value === String(vendorId),
                        ),
                    ),
                }))
                .filter((order) => order.line_items.length > 0) // Excluir órdenes sin productos válidos

            if (allOrders.length === 0) {
                throw new NotFoundException(
                    'No se encontraron órdenes con productos asociados a este vendedor.',
                )
            }

            return allOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes del vendedor.',
            )
        }
    }

    async getOrdersSellerByProduct({
        productId,
        startDate,
        endDate,
        vendorId,
    }: {
        productId: string
        startDate?: string
        endDate?: string
        vendorId: number
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

                const formattedOrders = orders.data.map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((item) => ({
                        product_id: item.product_id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.total,
                        meta_data: item.meta_data || [],
                    })),
                }))

                allOrders = [...allOrders, ...formattedOrders]
                page += 1
            }

            // Filtrar las órdenes para incluir solo el producto específico
            allOrders = allOrders
                .map((order) => ({
                    ...order,
                    line_items: order.line_items.filter(
                        (item) =>
                            item.product_id === Number(productId) &&
                            item.meta_data.some(
                                (product) =>
                                    product.key === 'vendedor' &&
                                    product.value === String(vendorId),
                            ),
                    ),
                }))
                .filter((order) => order.line_items.length > 0) // Excluir órdenes sin el producto válido

            if (allOrders.length === 0) {
                throw new NotFoundException(
                    `No se encontraron órdenes para el producto con ID ${productId}.`,
                )
            }

            return allOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes del producto.',
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
                date_paid: order.date_paid,
                line_items: Array.isArray(order.line_items)
                    ? order.line_items.map((item) => ({
                          product_id: item.product_id,
                          name: item.name,
                          quantity: item.quantity,
                          price: item.price,
                          total: item.total,
                          meta_data: item.meta_data || [],
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
