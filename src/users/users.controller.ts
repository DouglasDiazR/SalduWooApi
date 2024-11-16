import { Body, Controller, Get, HttpCode, Param, Query } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @HttpCode(200)
    getUsers(@Query('role') role?: string) {
        return this.usersService.getUsers(role)
    }

    @Get('email')
    @HttpCode(200)
    async getUserByEmail(@Body('email') email: string) {
        return await this.usersService.getUserByEmail(email)
    }

    @Get(':id')
    @HttpCode(200)
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }
}
