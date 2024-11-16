import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Customers } from 'src/entitys/customers.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Customers)
        private customersRepository: Repository<Customers>,
    ) {}
    async getUsers(role?: string): Promise<Customers[]> {
        try {
            const users =
                this.customersRepository.createQueryBuilder('customer')
            if (role) {
                users.where('customer.role = :role', { role })
            }
            return await users.getMany()
        } catch (error) {
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar los usuarios',
                error,
            )
        }
    }

    async getUserByEmail(email: string): Promise<Partial<Customers>> {
        try {
            const customer = await this.customersRepository
                .createQueryBuilder('customer')
                .select()
                .where('customer.email = :email', { email })
                .getOne()

            if (!customer)
                throw new NotFoundException(
                    `Cliente con email ${email} no encontrado.`,
                )
            return customer
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar el cliente.',
            )
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.customersRepository
                .createQueryBuilder()
                .select('customer')
                .from(Customers, 'customer')
                .where('customer.id_customers = :id', { id })
                .getOne()
            if (!user)
                throw new NotFoundException(
                    `Cliente con id ${id} no encontrado.`,
                )
            return user
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar el cliente.',
            )
        }
    }
}
