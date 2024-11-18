import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { JWT_SECRET } from 'src/config/envs'

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        )
        if (!roles) {
            // Si no hay roles definidos, permitir el acceso
            return true
        }

        const request = context.switchToHttp().getRequest()
        const token = request.headers['authorization']?.split(' ')[1] ?? ''

        if (!token) {
            throw new UnauthorizedException('Token no encontrado')
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: JWT_SECRET,
            })
            request.user = {
                id: payload.id,
                id_wooComerce: payload.id_wooComerce,
                role: payload.role,
            }
            if (!roles.includes(payload.role)) {
                throw new UnauthorizedException('Acceso denegado para este rol')
            }
        } catch (error) {
            throw new UnauthorizedException('Token inválido')
        }
        return true
    }
}
