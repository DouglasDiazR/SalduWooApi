import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreatePaymentOptionDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly siigoId?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly type: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  readonly isActive: boolean;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly orderIds?: number[];
}

export class UpdatePaymentOptionDTO extends PartialType(
  CreatePaymentOptionDTO
) {}
