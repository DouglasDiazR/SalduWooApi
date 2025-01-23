import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SingInUserDto } from './dto/singin-user.dto'
import { ApiOperation } from '@nestjs/swagger'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signIn')
    @ApiOperation({ summary: 'Ruta de login' })
    @HttpCode(200)
    signIn(@Body() body: SingInUserDto) {
        const { email, password } = body
        return this.authService.signIn(email, password)
    }
}
