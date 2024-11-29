import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import IOrders from './orders.interface'
import { formatDate } from 'src/utils/formatDate'

@Injectable()
export class OrdersService {
    constructor(private readonly WooCommerce: WooCommerceRestApi) {}

    async getAllOrders({
        startDate,
        endDate,
        page = 1,
        limit = 10,
    }: {
        startDate?: string
        endDate?: string
        page?: number
        limit?: number
    }): Promise<IOrders[]> {
        try {
            const formattedStartDate = startDate
                ? formatDate(startDate)
                : undefined
            const formattedEndDate = endDate ? formatDate(endDate) : undefined

            const orders: { data: IOrders[] } = await this.WooCommerce.get(
                'orders',
                {
                    page,
                    per_page: limit,
                    after: formattedStartDate,
                    before: formattedEndDate,
                },
            )

            if (orders.data.length === 0) {
                throw new NotFoundException('No se encontraron órdenes')
            }

            const formattedOrders = orders.data.map((order) => ({
                id: order.id,
                number: order.number,
                status: order.status,
                total: order.total,
                date_created: order.date_created,
                date_modified: order.date_modified,
                date_paid: order.date_paid,
                line_items: order.line_items
                    .map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data || [],
                    }))
                    .map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data.filter(
                            (meta) => meta.key === 'vendedor',
                        ),
                    })),
            }))

            return formattedOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException('Hubo un error al obtener.')
        }
    }

    async getOrdersByProduct({
        productId,
        startDate,
        endDate,
        page = 1,
        limit = 10,
    }: {
        productId: number
        startDate?: string
        endDate?: string
        page?: number
        limit?: number
    }): Promise<IOrders[]> {
        try {
            const formattedStartDate = startDate
                ? formatDate(startDate)
                : undefined
            const formattedEndDate = endDate ? formatDate(endDate) : undefined

            let allOrders: IOrders[] = []
            let currentPage = page

            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page: currentPage,
                        per_page: limit,
                        after: formattedStartDate,
                        before: formattedEndDate,
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
                    line_items: order.line_items
                        .map((product) => ({
                            product_id: product.product_id,
                            name: product.name,
                            quantity: product.quantity,
                            price: product.price,
                            total: product.total,
                            meta_data: product.meta_data || [],
                        }))
                        .map((product) => ({
                            product_id: product.product_id,
                            name: product.name,
                            quantity: product.quantity,
                            price: product.price,
                            total: product.total,
                            meta_data: product.meta_data.filter(
                                (meta) => meta.key === 'vendedor',
                            ),
                        })),
                }))

                allOrders = [...allOrders, ...formattedOrders]
                currentPage++
            }
            const ordersWithProduct = allOrders.filter((order) =>
                order.line_items.some(
                    (item) => item.product_id === Number(productId),
                ),
            )
            if (ordersWithProduct.length === 0) {
                throw new NotFoundException(
                    'No se encontraron órdenes con el producto especificado.',
                )
            }

            return ordersWithProduct
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
        page = 1,
        limit = 10,
    }: {
        startDate?: string
        endDate?: string
        page?: number
        limit?: number
        vendorId: number
    }): Promise<IOrders[]> {
        try {
            const formattedStartDate = startDate
                ? formatDate(startDate)
                : undefined
            const formattedEndDate = endDate ? formatDate(endDate) : undefined

            const orders: { data: IOrders[] } = await this.WooCommerce.get(
                'orders',
                {
                    page,
                    per_page: limit,
                    after: formattedStartDate,
                    before: formattedEndDate,
                },
            )

            if (orders.data.length === 0) {
                throw new NotFoundException('No se encontraron órdenes')
            }

            const formattedOrders = orders.data
                .map((order) => {
                    const filteredLineItems = order.line_items.filter((item) =>
                        item.meta_data.some(
                            (meta) =>
                                meta.key === 'vendedor' &&
                                meta.value === String(vendorId),
                        ),
                    )

                    if (filteredLineItems.length > 0) {
                        return {
                            id: order.id,
                            number: order.number,
                            status: order.status,
                            total: order.total,
                            date_created: order.date_created,
                            date_modified: order.date_modified,
                            date_paid: order.date_paid,
                            line_items: filteredLineItems
                                .map((product) => ({
                                    product_id: product.product_id,
                                    name: product.name,
                                    quantity: product.quantity,
                                    price: product.price,
                                    total: product.total,
                                    meta_data: product.meta_data || [],
                                }))
                                .map((product) => ({
                                    product_id: product.product_id,
                                    name: product.name,
                                    quantity: product.quantity,
                                    price: product.price,
                                    total: product.total,
                                    meta_data: product.meta_data.filter(
                                        (meta) => meta.key === 'vendedor',
                                    ),
                                })),
                        }
                    }
                    return null
                })
                .filter((order) => order !== null)

            if (formattedOrders.length === 0) {
                throw new NotFoundException(
                    'No se encontraron órdenes con productos asociados a este vendedor.',
                )
            }

            return formattedOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes del vendedor.',
            )
        }
    }

    /* async getOrdersSellerByProduct({
        productId,
        startDate,
        endDate,
        vendorId,
        page = 1,
        limit = 10,
    }: {
        productId: string
        startDate?: string
        endDate?: string
        vendorId: number
        page?: number
        limit?: number
    }): Promise<IOrders[]> {
        const formattedStartDate = startDate ? formatDate(startDate) : undefined
        const formattedEndDate = endDate ? formatDate(endDate) : undefined

        let allOrders: IOrders[] = []
        let currentPage = 1

        try {
            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page: currentPage,
                        per_page: limit,
                        after: formattedStartDate,
                        before: formattedEndDate,
                    },
                )

                if (orders.data.length === 0) break

                allOrders = [...allOrders, ...orders.data]
                currentPage++
            }

            const filteredOrders = allOrders
                .map((order) => {
                    const filteredLineItems = order.line_items.filter(
                        (item) =>
                            item.product_id === Number(productId) &&
                            item.meta_data.some(
                                (meta) =>
                                    meta.key === 'vendedor' &&
                                    meta.value === String(vendorId),
                            ),
                    )

                    if (filteredLineItems.length > 0) {
                        return {
                            id: order.id,
                            number: order.number,
                            status: order.status,
                            total: order.total,
                            date_created: order.date_created,
                            date_modified: order.date_modified,
                            date_paid: order.date_paid,
                            line_items: filteredLineItems.map((product) => ({
                                product_id: product.product_id,
                                name: product.name,
                                quantity: product.quantity,
                                price: product.price,
                                total: product.total,
                                meta_data: product.meta_data || [],
                            })),
                        }
                    }
                    return null
                })
                .filter((order) => order !== null)

            if (filteredOrders.length === 0) {
                throw new NotFoundException(
                    `No se encontraron órdenes para el producto con ID ${productId}.`,
                )
            }

            return filteredOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes para el producto especificado.',
            )
        }
    } */

    async getOrdersSellerByProduct({
        productId,
        startDate,
        endDate,
        vendorId,
        page = 1,
        limit = 10,
    }: {
        productId: string
        startDate?: string
        endDate?: string
        vendorId: number
        page?: number
        limit?: number
    }): Promise<IOrders[]> {
        const formattedStartDate = startDate ? formatDate(startDate) : undefined
        const formattedEndDate = endDate ? formatDate(endDate) : undefined

        let currentPage = page
        let allOrders: IOrders[] = []

        try {
            while (true) {
                const orders: { data: IOrders[] } = await this.WooCommerce.get(
                    'orders',
                    {
                        page: currentPage,
                        per_page: limit,
                        after: formattedStartDate,
                        before: formattedEndDate,
                    },
                )

                if (orders.data.length === 0) break

                allOrders = [...allOrders, ...orders.data]

                currentPage++
            }

            const filteredOrders = allOrders
                .filter((order) =>
                    order.line_items.some(
                        (item) =>
                            item.product_id === Number(productId) &&
                            item.meta_data.some(
                                (meta) =>
                                    meta.key === 'vendedor' &&
                                    meta.value === String(vendorId),
                            ),
                    ),
                )
                .map((order) => ({
                    id: order.id,
                    number: order.number,
                    status: order.status,
                    total: order.total,
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items
                        .filter(
                            (item) =>
                                item.product_id === Number(productId) &&
                                item.meta_data.some(
                                    (meta) =>
                                        meta.key === 'vendedor' &&
                                        meta.value === String(vendorId),
                                ),
                        )
                        .map((product) => ({
                            product_id: product.product_id,
                            name: product.name,
                            quantity: product.quantity,
                            price: product.price,
                            total: product.total,
                            meta_data: product.meta_data.filter(
                                (meta) => meta.key === 'vendedor',
                            ),
                        })),
                }))

            if (filteredOrders.length === 0) {
                throw new NotFoundException(
                    `No se encontraron órdenes para el producto con ID ${productId}.`,
                )
            }

            return filteredOrders
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes para el producto especificado.',
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
