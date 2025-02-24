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

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly orderDate: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly orderTotal: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly documentType: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly document: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly businessName: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly firstname: string
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly lastname: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly address: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly phone: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly email: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly commission?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly shippingPrice?: number
    
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly paybackPrice?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly taxedPrice?: number

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

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly disperssionUrl?: string

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
