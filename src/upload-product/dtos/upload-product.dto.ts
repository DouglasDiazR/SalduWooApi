import { ApiProperty, PartialType } from '@nestjs/swagger'
import { IsNumber, IsNotEmpty, IsString, IsDate, IsOptional } from 'class-validator'

export class CreateUploadProductDTO {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    readonly providerId: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly sku: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly description: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly shortDescription?: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    stock?: number

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly unit?: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    weightKg?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    lengthCm?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    widthCm?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    heightCm?: number

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly type?: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty()
    basePrice: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    iva?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    baseIva?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    salduCommission?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    commissionIva?: number

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    finalPrice?: number

    @IsString()
    @IsOptional()
    @ApiProperty()
    categories?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly brand?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly imagesUrl?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly status: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly address?: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly city: string

    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly state: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly dueDate?: Date

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly macrocategory?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly category?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly subcategory?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly class?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly priceUrl1?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly priceUrl2?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly priceUrl3?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly urlImage1?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly urlImage2?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly urlImage3?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly urlImage4?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly urlImage5?: string
}

export class UpdateUploadProductDTO extends PartialType(
    CreateUploadProductDTO,
) {}
