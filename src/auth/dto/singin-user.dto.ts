import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SingInUserDto {
    @ApiProperty({
        description: 'Correo electrónico del usuario para el login',
        example: 'example@mail.com',
        type: String,
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Contraseña del usuario para el login',
        example: 'Password123',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    password: string
}