import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'

@ApiTags('Usuarios')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    @ApiOperation({
        summary:
            'Ruta de Administrador para obtener todos los usuarios por rol',
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    @ApiQuery({
        name: 'role',
        required: false,
        type: String,
        description: 'Filtrar usuarios por rol',
    })
    getUsers(@Query('role') role?: string) {
        return this.usersService.getUsers(role)
    }

    @Post('email')
    @ApiOperation({
        summary: 'Ruta de Administrador para obtener un usuario por email',
    })
    @ApiBody({
        schema: {
            type: 'object',
            description: 'Email del usuario',
            example: {
                email: 'example@mail',
            },
        },
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getUserByEmail(@Body('email') email: string) {
        return await this.usersService.getUserByEmail(email)
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Ruta de Administrador para obtener un usuario por id',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID del usuario',
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getUserById(@Param('id') id: string) {
        return await this.usersService.getUserById(id)
    }
}
