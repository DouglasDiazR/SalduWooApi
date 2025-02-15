import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import IWooCommerceCustomer from './wooApi.interface'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Products } from 'src/entities/products.entity'
import { Users } from 'src/entities/users.entity'
import {
    CreateWooProductDTO,
    UpdateWooProductDTO,
} from './dtos/woo-product.dto'

@Injectable()
export class WooCommerceService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly WooCommerce: WooCommerceRestApi,
    ) {}

    async getUsers() {
        const roles = ['vendedor', 'administrator']
        const perPage = 100
        let users: IWooCommerceCustomer[] = []

        try {
            for (const role of roles) {
                let page = 1
                while (true) {
                    const response = await this.WooCommerce.get('customers', {
                        page,
                        per_page: perPage,
                        role,
                    })

                    if (response.data.length === 0) break

                    users = [...users, ...response.data]
                    page += 1
                }
            }

            const newUsers = await Promise.all(
                users.map(async (user: IWooCommerceCustomer) => {
                    const existinguser = await this.usersRepository
                        .createQueryBuilder('user')
                        .where('user.email = :email', {
                            email: user.email,
                        })
                        .orWhere('user.id_wooCommerce = :id_wooCommerce', {
                            id_wooCommerce: user.id,
                        })
                        .getOne()

                    if (existinguser) return null

                    const randomPassword = Math.random().toString(36).slice(-8)
                    console.log(
                        'user:',
                        user.email,
                        'passRAndom:',
                        randomPassword,
                    )
                    const hashedPassword = await bcrypt.hash(randomPassword, 10)

                    return {
                        id_wooCommerce: user.id,
                        email: user.email.toLocaleLowerCase(),
                        name: user.first_name.toLocaleLowerCase(),
                        role: user.role,
                        password: hashedPassword,
                    }
                }),
            )

            const saveUsers = newUsers.filter(
                (user): user is Users => user !== null,
            )

            if (saveUsers.length > 0) {
                await this.usersRepository.save(saveUsers)
            }

            const usersWithoutPassword = saveUsers.map(
                ({ password, ...rest }) => rest,
            )

            return usersWithoutPassword
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al registrar los Clientes',
            )
        }
    }

    async getProducts() {
        try {
            const per_page = 50
            for (let page = 1; ; page++) {
                const response = await this.WooCommerce.get('products', {
                    per_page,
                    page,
                })
                if (response.data.length === 0) break
                for (const product of response.data) {
                    const id_wooCommerce = await product.meta_data.find(
                        (meta) => meta.key === 'vendedor',
                    )?.value
                    if (!id_wooCommerce)
                        console.log(
                            `vendedor no encontrado para el producto: ${product.id}`,
                        )
                    const user = id_wooCommerce
                        ? await this.usersRepository.findOne({
                              where: { id_wooCommerce: Number(id_wooCommerce) },
                          })
                        : null
                    const newProduct = await this.productsRepository.create({
                        ...product,
                        date_created: product.date_created ?? '',
                        date_created_gmt: product.date_created_gmt ?? '',
                        date_modified: product.date_modified ?? '',
                        date_modified_gmt: product.date_modified_gmt ?? '',
                        price: product.price ? parseFloat(product.price) : 0,
                        regular_price: product.regular_price
                            ? parseFloat(product.regular_price)
                            : 0,
                        sale_price: product.sale_price
                            ? parseFloat(product.sale_price)
                            : 0,
                        date_on_sale_from: product.date_on_sale_from ?? '',
                        date_on_sale_from_gmt:
                            product.date_on_sale_from_gmt ?? '',
                        date_on_sale_to: product.date_on_sale_to ?? '',
                        date_on_sale_to_gmt: product.date_on_sale_to_gmt ?? '',
                        stock_quantity: product.stock_quantity ?? 0,
                        low_stock_amount: product.low_stock_amount ?? '',
                        user: user,
                    })
                    await this.productsRepository.save(newProduct)
                }
            }
            return { message: 'Productos obtenidos' }
        } catch (error) {
            console.log('Error especifico:', error)
            throw new Error('Error al obtener los productos')
        }
    }

    // async getProduct(id) {
    //     try {
    //         const response = await this.WooCommerce.get(`products/${id}`)
    //         const newProduct = this.productsRepository.create({
    //             ...response.data,
    //             date_created: response.data.date_created ?? '',
    //             date_created_gmt: response.data.date_created_gmt ?? '',
    //             date_modified: response.data.date_modified ?? '',
    //             date_modified_gmt: response.data.date_modified_gmt ?? '',
    //             price: response.data.price ? parseFloat(response.data.price) : 0,
    //             regular_price: response.data.regular_price ? parseFloat(response.data.regular_price) : 0,
    //             sale_price: response.data.sale_price ? parseFloat(response.data.sale_price) : 0,
    //             date_on_sale_from: response.data.date_on_sale_from ?? '',
    //             date_on_sale_from_gmt: response.data.date_on_sale_from_gmt ?? '',
    //             date_on_sale_to: response.data.date_on_sale_to ?? '',
    //             date_on_sale_to_gmt: response.data.date_on_sale_to_gmt ?? '',
    //             stock_quantity: response.data.stock_quantity ?? 0,
    //             low_stock_amount: response.data.low_stock_amount ?? '',

    //         })
    //         return await this.productsRepository.save(newProduct)

    //     } catch (error) {
    //         throw new Error('Error al obtener los productos')
    //     }
    // }

    async createProduct(id: number, payload: CreateWooProductDTO) {}

    async updateProduct(id: number, payload: UpdateWooProductDTO) {
        try {
            const productResponse = await this.WooCommerce.get(`products/${id}`)
            const product = productResponse.data
            const isTaxable =
                product.meta_data.find((item) => item.key == '_exento_iva')
                    ?.value || ''
            const commission =
                product.meta_data.find(
                    (item) => item.key == '_percentage_commission',
                )?.value || '0.12'
            if (payload.price && isTaxable !== 'no') {
                const originalPrice = parseFloat(payload.price) / (1 + 1.19 + commission)
                const ivaBase = 0
                const baseSaldu = originalPrice * parseFloat(commission)
                const ivaBaseSaldu = baseSaldu * 0.19
                const commissionSaldu = baseSaldu + ivaBaseSaldu
                payload.regular_price = payload.price
                payload.meta_data = [
                    {
                        id: 235070,
                        key: '_product_original_price',
                        value: originalPrice.toFixed(2),
                    },
                    { id: 235071, key: '_iva_base', value: ivaBase.toFixed(2) },
                    { id: 235073, key: '_base_saldu', value: baseSaldu.toFixed(2) },
                    { id: 235074, key: '_iva_base_saldu', value: ivaBaseSaldu.toFixed(2) },
                    { id: 235075, key: '_comision_saldu', value: commissionSaldu.toFixed(2) },
                ]
            } else if (payload.price && isTaxable == 'no') {
                const originalPrice = parseFloat(payload.price) / 1.19 / 1.12
                const ivaBase = originalPrice * 0.19
                const baseSaldu = originalPrice * parseFloat(commission)
                const ivaBaseSaldu = baseSaldu * 0.19
                const commissionSaldu = baseSaldu + ivaBaseSaldu
                payload.regular_price = payload.price
                payload.meta_data = [
                    {
                        id: 235070,
                        key: '_product_original_price',
                        value: originalPrice.toFixed(2),
                    },
                    { id: 235071, key: '_iva_base', value: ivaBase.toFixed(2) },
                    { id: 235073, key: '_base_saldu', value: baseSaldu.toFixed(2) },
                    { id: 235074, key: '_iva_base_saldu', value: ivaBaseSaldu.toFixed(2) },
                    { id: 235075, key: '_comision_saldu', value: commissionSaldu.toFixed(2) },
                ]
            }
            const response = await this.WooCommerce.put(
                `products/${id}`,
                payload,
            )
            console.log('WooCommerce Update try: ', response)
        } catch (error) {
            console.log('WooCommerce Update fail: ', error)
        }
    }
}
