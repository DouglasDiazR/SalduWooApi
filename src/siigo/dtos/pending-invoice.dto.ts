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

export class CreatePendingInvoiceDTO {
    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly startDate?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly endDate?: string

    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly providerId?: number
}

export class UpdatePendingInvoiceDTO extends PartialType(CreatePendingInvoiceDTO) {}
