import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { WooApiModule } from 'src/wooApi/wooApi.module'

@Module({
    imports: [WooApiModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository],
})
export class AuthModule {}
