import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import IOrders from './orders.interface'
import { formatDate } from 'src/utils/formatDate'
import { Status } from 'src/enum/status.enum'

@Injectable()
export class OrdersService {
    constructor(private readonly WooCommerce: WooCommerceRestApi) {}

    async getAllOrders({
        status,
        startDate,
        endDate,
        page = 1,
        limit = 50,
    }: {
        status?: Status
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

            const orders: { data: any } = await this.WooCommerce.get(
                'orders',
                {
                    status,
                    page,
                    per_page: limit,
                    after: formattedStartDate,
                    before: formattedEndDate,
                },
            )
            console.log(orders)
            if (orders.data.length === 0) {
                return []
            }

            const formattedOrders = orders.data.map((order) => ({
                id: order.id,
                number: order.number,
                status: order.status,
                total: order.total,
                invoicing: {
                    // documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                    // document: order.meta_data.find(item => item.key == '_numero_nit').value || 'NA',
                    // businessName: order.meta_data.find(item => item.key == '_razon_social').value || 'NA',
                    // firstname: 'string',
                    // lastname: 'string',
                    // address: order.meta_data.find(item => item.key == '_direccion_facturacion').value || 'NA',
                    // phone: order.meta_data.find(item => item.key == '_telefono_emp') ? order.meta_data.find(item => item.key == '_telefono_emp').value : order.meta_data.find(item => item.key == '_telefono').value || 'NA',
                    // email: order.meta_data.find(item => item.key == '_email_rut').value || 'NA',
                    // commission: 123,
                    // payBackPrice: 123,
                    // shippingPrice: 123,
                    documentType: 'CC',
                    document: 'NA',
                    businessName: 'NA',
                    firstname: 'string',
                    lastname: 'string',
                    address: 'NA',
                    phone: 'NA',
                    email: 'NA',
                    commission: 123,
                    payBackPrice: 123,
                    shippingPrice: 123,
                },
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

            let allOrders: any = []
            let currentPage = page

            while (true) {
                const orders: { data: any } = await this.WooCommerce.get(
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
                    invoicing: {
                        documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                        document: order.meta_data.find(item => item.key == '_numero_nit').value,
                        businessName: order.meta_data.find(item => item.key == '_razon_social').value,
                        firstname: 'string',
                        lastname: 'string',
                        address: order.meta_data.find(item => item.key == '_direccion_facturacion').value,
                        phone: order.meta_data.find(item => item.key == '_telefono_emp') ? order.meta_data.find(item => item.key == '_telefono_emp').value : order.meta_data.find(item => item.key == '_telefono').value,
                        email: order.meta_data.find(item => item.key == '_email_rut').value,
                        commission: 123,
                        payBackPrice: 123,
                        shippingPrice: 123,
                    },
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

    async getOrdersBySeller({
        vendorId,
        startDate,
        endDate,
        page = 1,
        limit = 10,
    }: {
        vendorId: string
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

            let allOrders: any = []
            let currentPage = page

            while (true) {
                const orders: { data: any } = await this.WooCommerce.get(
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
                    invoicing: {
                        documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                        document: order.meta_data.find(item => item.key == '_numero_nit').value,
                        businessName: order.meta_data.find(item => item.key == '_razon_social').value,
                        firstname: 'string',
                        lastname: 'string',
                        address: order.meta_data.find(item => item.key == '_direccion_facturacion').value,
                        phone: order.meta_data.find(item => item.key == '_telefono_emp') ? order.meta_data.find(item => item.key == '_telefono_emp').value : order.meta_data.find(item => item.key == '_telefono').value,
                        email: order.meta_data.find(item => item.key == '_email_rut').value,
                        commission: 123,
                        payBackPrice: 123,
                        shippingPrice: 123,
                    },
                    date_created: order.date_created,
                    date_modified: order.date_modified,
                    date_paid: order.date_paid,
                    line_items: order.line_items.map((product) => ({
                        product_id: product.product_id,
                        name: product.name,
                        quantity: product.quantity,
                        price: product.price,
                        total: product.total,
                        meta_data: product.meta_data?.filter(
                            (meta) =>
                                meta.key === 'vendedor' &&
                                meta.value === vendorId,
                        ),
                    })),
                }))

                allOrders = [...allOrders, ...formattedOrders]
                currentPage++
            }

            const ordersByVendor = allOrders.filter((order) =>
                order.line_items.some(
                    (item) => item.meta_data && item.meta_data.length > 0,
                ),
            )

            if (ordersByVendor.length === 0) {
                throw new NotFoundException(
                    'No se encontraron órdenes para el vendedor especificado.',
                )
            }

            return ordersByVendor
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener las órdenes para el vendedor especificado.',
            )
        }
    }

    async getAllOrdersForSeller({
        status,
        startDate,
        endDate,
        vendorId,
        page = 1,
        limit = 10,
    }: {
        status?: Status
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

            const orders: { data: any } = await this.WooCommerce.get(
                'orders',
                {
                    status,
                    page,
                    per_page: limit,
                    after: formattedStartDate,
                    before: formattedEndDate,
                },
            )
            console.log();
            
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
                            invoicing: {
                                documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                                document: order.meta_data.find(item => item.key == '_numero_nit').value,
                                businessName: order.meta_data.find(item => item.key == '_razon_social').value,
                                firstname: 'string',
                                lastname: 'string',
                                address: order.meta_data.find(item => item.key == '_direccion_facturacion').value,
                                phone: order.meta_data.find(item => item.key == '_telefono_emp') ? order.meta_data.find(item => item.key == '_telefono_emp').value : order.meta_data.find(item => item.key == '_telefono').value,
                                email: order.meta_data.find(item => item.key == '_email_rut').value,
                                commission: 123,
                                payBackPrice: 123,
                                shippingPrice: 123,
                            },
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
        let allOrders: any = []

        try {
            while (true) {
                const orders: { data: any } = await this.WooCommerce.get(
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
                    invoicing: {
                        documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                        document: order.meta_data.find(item => item.key == '_numero_nit').value,
                        businessName: order.meta_data.find(item => item.key == '_razon_social').value,
                        firstname: 'string',
                        lastname: 'string',
                        address: order.meta_data.find(item => item.key == '_direccion_facturacion').value,
                        phone: order.meta_data.find(item => item.key == '_telefono_emp') ? order.meta_data.find(item => item.key == '_telefono_emp').value : order.meta_data.find(item => item.key == '_telefono').value,
                        email: order.meta_data.find(item => item.key == '_email_rut').value,
                        commission: 123,
                        payBackPrice: 123,
                        shippingPrice: 123,
                    },
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

    async getOrderById(id: number): Promise<IOrders> {
        try {
            const response: { data: any } = await this.WooCommerce.get(
                `orders/${id}`,
            )

            if (!response || !response.data) {
                throw new NotFoundException(
                    `La orden con ID ${id} no fue encontrada.`,
                )
            }

            const order = response.data

            console.log(JSON.stringify(order));

            const formattedOrder: IOrders = {
                id: order.id,
                number: order.number,
                status: order.status,
                total: order.total,
                invoicing: {
                    documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                    document: order.meta_data.find(item => item.key == '_numero_nit')?.value || '0',
                    businessName: order.meta_data.find(item => item.key == '_razon_social')?.value || '',
                    firstname: order.meta_data.find(item => item.key == '_nombre')?.value || '',
                    lastname: order.meta_data.find(item => item.key == '_apellido')?.value || '',
                    address: order.meta_data.find(item => item.key == '_direccion_facturacion')?.value || '',
                    phone: order.meta_data.find(item => item.key == '_telefono_emp') 
                        ? order.meta_data.find(item => item.key == '_telefono_emp')?.value
                        : order.meta_data.find(item => item.key == '_telefono')?.value || '0',
                    email: order.meta_data.find(item => item.key == '_email_rut')?.value 
                        ? order.billing.email 
                        : '',
                    commission: order.meta_data.find(item => item.key == '_comision_saldu')?.value || 0,
                    payBackPrice: order.meta_data.find(item => item.key == '_reintegro_pasarela')?.value || "0",
                    shippingPrice: order.shipping_lines[0]?.total || 0,
                },
                date_created: order.date_created,
                date_modified: order.date_modified,
                date_paid: order.date_paid || '',
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
            };
            console.log(formattedOrder);
            
            return formattedOrder
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener la orden. Por favor, intente nuevamente.',
            )
        }
    }

    async updateOrder(id: number, payload: string): Promise<IOrders> {
        try {
            const response: { data: any } = await this.WooCommerce.put(
                `orders/${id}`,
                { status: payload }
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
                invoicing: {
                    documentType: order.meta_data.find(item => item.key == '_telefono_emp') ? 'NIT' : 'CC',
                    document: order.meta_data.find(item => item.key == '_numero_nit')?.value || '0',
                    businessName: order.meta_data.find(item => item.key == '_razon_social')?.value || '',
                    firstname: order.meta_data.find(item => item.key == '_nombre')?.value || '',
                    lastname: order.meta_data.find(item => item.key == '_apellido')?.value || '',
                    address: order.meta_data.find(item => item.key == '_direccion_facturacion')?.value || '',
                    phone: order.meta_data.find(item => item.key == '_telefono_emp') 
                        ? order.meta_data.find(item => item.key == '_telefono_emp')?.value
                        : order.meta_data.find(item => item.key == '_telefono')?.value || '0',
                    email: order.meta_data.find(item => item.key == '_email_rut')?.value 
                        ? order.billing.email 
                        : '',
                    commission: order.meta_data.find(item => item.key == '_comision_saldu')?.value || 0,
                    payBackPrice: order.meta_data.find(item => item.key == '_reintegro_pasarela')?.value || "0",
                    shippingPrice: order.shipping_lines[0]?.total || 0,
                },
                date_created: order.date_created,
                date_modified: order.date_modified,
                date_paid: order.date_paid || '',
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
            };            
            return formattedOrder
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener la orden. Por favor, intente nuevamente.',
            ) 
        }
    }
}
