import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator'

export class CreateInvoiceDTO {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly orderId: number

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly orderTotal: number

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly siigoId?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly siigoStatus?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly siigoName?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly cufe?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly siigoDate?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly publicUrl?: string

    @IsBoolean()
    @IsOptional()
    @ApiProperty()
    readonly customerMailed?: boolean

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly paymentOptionId?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly salduProductId?: number
}

export class UpdateInvoiceDTO extends PartialType(CreateInvoiceDTO) {}
