import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { UsersRepository } from 'src/users/users.repository'

@Injectable()
export class AuthRepository {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(email: string, password: string) {
        try {
            if (!email || !password) {
                throw new BadRequestException('Email y password requeridos')
            }
            const findedCustomer =
                await this.usersRepository.getUserByEmail(email)
            if (!findedCustomer) {
                throw new BadRequestException('Credenciales incorrectas')
            }
            const validPassword = await bcrypt.compare(
                password,
                findedCustomer.password,
            )
            if (!validPassword) {
                throw new BadRequestException('Credenciales incorrectas')
            }
            const payload = {
                sub: findedCustomer.id_customers,
                id: findedCustomer.id_customers,
                id_wooCommerce: findedCustomer.id_wooCommerce,
                name: findedCustomer.name,
                role: findedCustomer.role,
            }
            const token = this.jwtService.sign(payload)

            return {
                message: 'Usuario logeado',
                token,
            }
        } catch (error) {
            if (error instanceof BadRequestException) throw error
            throw new InternalServerErrorException(
                'No se pudo iniciar sesión',
                error,
            )
        }
    }
}
