import { Body, Controller, HttpCode, Post } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signIn')
    @HttpCode(201)
    signIn(@Body() body: { email: string; password: string }) {
        const { email, password } = body
        return this.authService.signIn(email, password)
    }
}
