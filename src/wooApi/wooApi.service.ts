import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { Customers } from 'src/entitys/customers.entity'
import IWooCommerceCustomer from './wooApi.interface'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Products } from 'src/entitys/products.entity'

@Injectable()
export class WooCommerceService {
    constructor(
        @InjectRepository(Customers)
        private readonly customersRepository: Repository<Customers>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
        private readonly WooCommerce: WooCommerceRestApi,
    ) {}

    async getApiEndpoints() {
        try {
            const response = await this.WooCommerce.get('')
            return response.data
        } catch (error) {
            throw new Error('Error al obtener los puntos finales')
        }
    }

    async getCustomers() {
        const roles = ['vendedor', 'administrator']
        const perPage = 100
        let customers: IWooCommerceCustomer[] = []

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

                    customers = customers.concat(response.data)
                    page += 1
                }
            }

            const newCustomers = await Promise.all(
                customers.map(async (customer: IWooCommerceCustomer) => {
                    const existingCustomer = await this.customersRepository
                        .createQueryBuilder('customer')
                        .where('customer.email = :email', {
                            email: customer.email,
                        })
                        .orWhere('customer.id_wooCommerce = :id_wooCommerce', {
                            id_wooCommerce: customer.id,
                        })
                        .getOne()

                    if (existingCustomer) return null

                    const randomPassword = Math.random().toString(36).slice(-8)
                    console.log(
                        'customer:',
                        customer.email,
                        'passRAndom:',
                        randomPassword,
                    )
                    const hashedPassword = await bcrypt.hash(randomPassword, 10)

                    return {
                        id_wooCommerce: customer.id,
                        email: customer.email.toLocaleLowerCase(),
                        name: customer.first_name.toLocaleLowerCase(),
                        role: customer.role,
                        password: hashedPassword,
                    }
                }),
            )

            const saveCustomers = newCustomers.filter(
                (customer): customer is Customers => customer !== null,
            )

            if (saveCustomers.length > 0) {
                await this.customersRepository.save(saveCustomers)
            }

            return saveCustomers
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al registrar los Clientes',
            )
        }
    }

    async getProducts() {
        const per_page = 50
        // const allProducts = []
        for (let page = 1; ; page++) {
            try {
                const response = await this.WooCommerce.get('products', {
                    per_page,
                    page,
                })
                if (response.data.length === 0) break
                for (const product of response.data) {
                    const newProduct = await this.productsRepository.create({
                        id: product.id,
                        name: product.name,
                        permalink: product.permalink,
                        type: product.type,
                        status: product.status,
                        featured: product.featured,
                        catalog_visibility: product.catalog_visibility,
                        description: product.description,
                    })
                    await this.productsRepository.save(newProduct)
                }
                // allProducts.push(...response.data)
            } catch (error) {
                throw new Error('Error al obtener los productos')
            }
        }
        // return allProducts
        return { message: 'Productos obtenidos' }
    }
}
