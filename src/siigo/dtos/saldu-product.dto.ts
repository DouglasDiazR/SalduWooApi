import { ApiProperty, PartialType } from '@nestjs/swagger'
import {
    IsArray,
    IsJSON,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
} from 'class-validator'

export class CreateSalduProductDTO {
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    readonly internalCode: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly siigoId?: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly name: string

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    readonly description: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly taxDiscountId?: number

    @IsArray()
    @IsOptional()
    @ApiProperty()
    readonly chargeIds?: number[]
}

export class UpdateSalduProductDTO extends PartialType(CreateSalduProductDTO) {}
