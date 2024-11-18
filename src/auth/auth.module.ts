import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AuthRepository } from './auth.repository'
import { WooApiModule } from 'src/wooApi/wooApi.module'
import { UsersRepository } from 'src/users/users.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Users } from 'src/entities/users.entity'

@Module({
    imports: [TypeOrmModule.forFeature([Users]), WooApiModule],
    controllers: [AuthController],
    providers: [AuthService, AuthRepository, UsersRepository],
})
export class AuthModule {}
