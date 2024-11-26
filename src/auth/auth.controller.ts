import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { SingInUserDto } from './dto/singin-user.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signIn')
    @HttpCode(201)
    signIn(@Body() body: SingInUserDto) {
        const { email, password } = body
        return this.authService.signIn(email, password)
    }
}
