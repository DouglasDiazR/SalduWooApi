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

export class SiigoError {
    Code: string
    Message: string
    Params: string[]
    Detail: string
}

export class SiigoStamp {
    status: string
    cufe: string
    observations: string
    errors: string
}

export class SiigoMailStatus {
    status: string
    observations: string
}

export class SiigoResponseDTO {
    @IsNumber()
    @IsOptional()
    @ApiProperty()
    readonly Status?: number

    @IsArray()
    @IsOptional()
    @ApiProperty()
    readonly Errors?: SiigoError[]

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly id?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly name?: string

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly date?: string

    @IsOptional()
    @ApiProperty()
    readonly stamp?: SiigoStamp

    @IsOptional()
    @ApiProperty()
    readonly mail?: SiigoMailStatus

    @IsString()
    @IsOptional()
    @ApiProperty()
    readonly public_url?: string
}
