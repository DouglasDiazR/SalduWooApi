import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString
} from 'class-validator';

export class CreateOrderEvidencetDTO {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  readonly wooCommerceId?: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly deliveryUrl: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly sellerInvoiceUrl: string;
}

export class UpdateOrderEvidenceDTO extends PartialType(CreateOrderEvidencetDTO) {}