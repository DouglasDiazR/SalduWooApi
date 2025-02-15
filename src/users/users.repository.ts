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
            const findedUsers = this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id_user',
                    'user.id_wooCommerce',
                    'user.name',
                    'user.email',
                    'user.role',
                ])
            if (role) {
                findedUsers.where('user.role = :role', { role })
            }

            const users = await findedUsers.getMany()

            if (users.length === 0) {
                throw new NotFoundException('No se encontraron usuarios.')
            }
            return users
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Ocurrió un error inesperado al buscar los usuarios',
                error,
            )
        }
    }

    async getUserByEmail(email: string): Promise<Partial<Users>> {
        try {
            const user = await this.usersRepository
                .createQueryBuilder('user')
                .select([
                    'user.id_user',
                    'user.id_wooCommerce',
                    'user.name',
                    'user.email',
                    'user.role',
                    'user.password',
                ])
                .where('user.email = :email', { email })
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

    async getUserById(id: number): Promise<Partial<Users>> {
        try {
            const user = await this.usersRepository
                .createQueryBuilder()
                .select([
                    'user.id_user',
                    'user.id_wooCommerce',
                    'user.name',
                    'user.email',
                    'user.role',
                ])
                .from(Users, 'user')
                .where('user.id_wooCommerce = :id', { id })
                .getOne()
            if (!user)
                throw new NotFoundException(
                    `Usuario con id ${id} no encontrado.`,
                )
            return user
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                `Ocurrió un error inesperado al buscar el usuario. ${error}`,
            )
        }
    }
}
