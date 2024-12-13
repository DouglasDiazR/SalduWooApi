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

export class CreateInvoiceErrorLogDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly code: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly message: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly param: string;

  @IsArray()
  @IsOptional()
  @ApiProperty()
  readonly invoiceId: number;
}

export class UpdateInvoiceErrorLogDTO extends PartialType(
  CreateInvoiceErrorLogDTO
) {}