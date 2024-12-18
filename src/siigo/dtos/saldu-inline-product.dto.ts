import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator'

export class CreateSalduInlineProductDTO {
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    readonly taxedPrice?: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    readonly salduProductId: number

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    readonly invoiceId: number
}

export class UpdateSalduInlineProductDTO extends PartialType(
    CreateSalduInlineProductDTO,
) {}
