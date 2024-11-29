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
            const user = await this.usersRepository.getUserByEmail(email)
            if (!user) {
                throw new BadRequestException('Credenciales incorrectas')
            }
            const validPassword = await bcrypt.compare(password, user.password)

            if (!validPassword) {
                throw new BadRequestException('Credenciales incorrectas')
            }
            const payload = {
                sub: user.id_user,
                id: user.id_user,
                id_wooCommerce: user.id_wooCommerce,
                name: user.name,
                role: user.role,
            }
            const token = this.jwtService.sign(payload)

            return {
                message: 'Usuario logeado',
                role: user.role,
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
