import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { Customers } from 'src/entitys/customers.entity'
import { Repository } from 'typeorm'

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
            console.error(
                'Error al obtener los puntos finales:',
                error.response?.data || error.message,
            )
            throw error
        }
    }

    async getCustomers() {
        try {
            const response = await this.WooCommerce.get('customers')
            const customers = response.data.map((customer: any) => ({
                id_wooCommerce: customer.id,
                email: customer.email,
                name: customer.first_name,
                role: customer.role,
            }))

            const saveCustomers = await this.customersRepository.save(customers)

            return saveCustomers
        } catch (error) {
            console.error(
                'Error al obtener los puntos clientes:',
                error.response?.data || error.message,
            )
            throw error
        }
    }
}
