import { Module } from '@nestjs/common'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import { UsersRepository } from './users.repository'
import { Customers } from 'src/entitys/customers.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [TypeOrmModule.forFeature([Customers])],
    controllers: [UsersController],
    providers: [UsersService, UsersRepository],
})
export class UsersModule {}
