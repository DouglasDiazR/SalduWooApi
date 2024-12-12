import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreateTaxDiscountDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly siigoId?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly category: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  readonly value: number;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly chargeIds?: number[];
}

export class UpdateTaxDiscountDTO extends PartialType(CreateTaxDiscountDTO) {}
