import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    getUsers(@Query('role') role?: string) {
        return this.usersService.getUsers(role)
    }

    @Get('email')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getUserByEmail(@Body('email') email: string) {
        return await this.usersService.getUserByEmail(email)
    }

    @Get(':id')
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }
}
