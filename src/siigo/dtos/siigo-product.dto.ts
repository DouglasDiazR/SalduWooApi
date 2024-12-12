import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
  } from 'class-validator';
  
  class PriceList {
    position: number;
    value: number;
  }
  
  class Price {
    currency_code: string;
    price_list: PriceList[];
  }
  
  class AdditionalFields {
    barcode: string;
    brand: string;
    tariff: string; // Código arancelario.
    model: string;
  }
  
  enum TaxClassification {
    Taxed = 'Gravado',
    Exempt = 'Exento',
    Excluded = 'Excluido'
  }
  
  class Taxes {
    id?: number;
    mililiters?: number;
    rate?: number;
  }
  
  export class SiigoProductDTO {
    @IsString()
    @IsNotEmpty()
    readonly code: string; // Id del producto
  
    @IsString()
    @IsNotEmpty()
    readonly name: string;
  
    @IsNumber()
    @IsNotEmpty()
    readonly account_group: number; // Categoría??
  
    @IsString()
    @IsNotEmpty()
    readonly type: string; // Enum type
  
    @IsBoolean()
    @IsOptional()
    readonly stock_control?: boolean; //default = false
  
    @IsBoolean()
    @IsOptional()
    readonly active?: boolean; //default = true
  
    @IsString()
    @IsOptional()
    readonly tax_classification?: TaxClassification;
  
    @IsBoolean()
    @IsOptional()
    readonly tax_included?: boolean; //default = false
  
    @IsNumber()
    @IsNotEmpty()
    readonly tax_consumption_value: number;
  
    @IsArray()
    @IsNotEmpty()
    readonly taxes: Taxes[];
  
    @IsArray()
    @IsNotEmpty()
    readonly prices?: Price[];
  
    @IsString()
    @IsOptional()
    readonly unit?: string; // código de unidad de medida
  
    @IsString()
    @IsOptional()
    readonly unit_label?: string; //unidad para impresión de factura
  
    @IsString()
    @IsOptional()
    readonly reference?: string; // Referencia o código de fábrica del producto.
  
    @IsString()
    @IsOptional()
    readonly description?: string;
  
    @IsOptional()
    readonly additional_fields?: AdditionalFields;
  }
  