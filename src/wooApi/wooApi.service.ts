import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { Customers } from 'src/entitys/customers.entity'
import IWooCommerceCustomer from './wooApi.interface'
import { In, Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'

@Injectable()
export class WooCommerceService {
    constructor(
        @InjectRepository(Customers)
        private customersRepository: Repository<Customers>,
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
}
