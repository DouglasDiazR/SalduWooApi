import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsNotEmpty,
  IsString,
  IsDate,
  IsOptional,
  Min,
  IsObject,
  IsArray,
} from 'class-validator';

export class CreateWooProductDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly slug: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly permalink: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly type: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly status: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly featured: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly short_description: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly sku: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  regular_price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly sale_price: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly manage_stock: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly stock_quantity: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly weight: string;

  @IsObject()
  @IsNotEmpty()
  @ApiProperty()
  readonly dimensions: {
    length: string,
    width: string,
    height: string,
  };

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly images: {
    id: number,
    src: string,
    name: string,
    alt: string,
  }[];

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  readonly categories: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  meta_data: any[];
}

export class UpdateWooProductDTO extends PartialType(CreateWooProductDTO) {}
