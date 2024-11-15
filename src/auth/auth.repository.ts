import {
    BadRequestException,
    Injectable,
    InternalServerErrorException,
} from '@nestjs/common'
import { WooCommerceService } from 'src/wooApi/wooApi.service'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthRepository {
    constructor(
        private readonly wooCommerceService: WooCommerceService,
        private readonly jwtService: JwtService,
    ) {}

    async signIn(email: string, password: string) {
        try {
            if (!email || !password) {
                throw new BadRequestException('Email y password requeridos')
            }
            const findedCustomer =
                await this.wooCommerceService.getCustomerByEmail(email)
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
            throw new InternalServerErrorException('No se pudo iniciar sesión')
        }
    }
}
