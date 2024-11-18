import {
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'
import { Repository } from 'typeorm'

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(Users)
        private usersRepository: Repository<Users>,
    ) {}
    async getUsers(role?: string): Promise<Users[]> {
        try {
            const users = this.usersRepository.createQueryBuilder('user')
            if (role) {
                users.where('user.role = :role', { role })
            }
            return await users.getMany()
        } catch (error) {
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar los usuarios',
                error,
            )
        }
    }

    async getUserByEmail(email: string): Promise<Partial<Users>> {
        try {
            const user = await this.usersRepository
                .createQueryBuilder('customer')
                .select()
                .where('customer.email = :email', { email })
                .getOne()

            if (!user)
                throw new NotFoundException(
                    `Usuario con email ${email} no encontrado.`,
                )
            return user
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar el usuario.',
            )
        }
    }

    async getUserById(id: string) {
        try {
            const user = await this.usersRepository
                .createQueryBuilder()
                .select('user')
                .from(Users, 'user')
                .where('user.id_user = :id', { id })
                .getOne()
            if (!user)
                throw new NotFoundException(
                    `Usuario con id ${id} no encontrado.`,
                )
            return user
        } catch (error) {
            console.log(error)
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar el usuario.',
            )
        }
    }
}
