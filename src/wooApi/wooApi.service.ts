import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { Customers } from 'src/entitys/customers.entity'
import IWooCommerceCustomer from './wooApi.interface'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Products } from 'src/entitys/products.entity'
import { all } from 'axios'

@Injectable()
export class WooCommerceService {
    constructor(
        @InjectRepository(Customers) private readonly customersRepository: Repository<Customers>,
        @InjectRepository(Products) private readonly productsRepository: Repository<Products>,
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
        try {
            const response = await this.WooCommerce.get('customers')
            const customers = await Promise.all(
                response.data.map(async (customer: IWooCommerceCustomer) => {
                    const existingCustomer =
                        await this.customersRepository.findOne({
                            where: { email: customer.email },
                        })

                    if (existingCustomer) {
                        console.log(
                            ` Cliente con email ${customer.email} ya existe.`,
                        )
                        return null
                    }
                    const ramdomPassword = Math.random().toString(36).slice(-8)
                    console.log(ramdomPassword)
                    const hashedPassword = await bcrypt.hash(ramdomPassword, 10)

                    return {
                        id_wooCommerce: customer.id,
                        email: customer.email,
                        name: customer.first_name,
                        role: customer.role,
                        password: hashedPassword,
                    }
                }),
            )
            const newCustomers = customers.filter(
                (customer): customer is Customers => customer !== null,
            )

            const saveCustomers =
                await this.customersRepository.save(newCustomers)

            return saveCustomers
        } catch (error) {
            throw new Error('Error al registrar los Clientes ')
        }
    }

    async getProducts() {
        const per_page = 50
        // const allProducts = []
        for (let page = 1; ; page++) {
            try {
                const response = await this.WooCommerce.get('products', {per_page, page})
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
        return { message: 'Productos obtenidos'}
    }
}
