import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
  } from 'class-validator';
  
  class Tax {
    id: number;
  }
  
  class Item {
    id: string;
    code: string;
    description?: string;
    quantity: number;
    taxed_price: number;
    discount: number;
    taxes: Tax[];
  }
  
  class Payment {
    id: number;
    value: number;
    due_date?: string; // Fecha pago cuota, formato yyyy-MM-dd.
  }
  
  class Discounts {
    id: number;
    percentage: number;
    value: number;
  }
  
  export class SiigoInvoiceDTO {
    @IsNotEmpty()
    readonly document: {
      id: number;
    };
  
    @IsString()
    @IsNotEmpty()
    readonly date: string; // Fecha de la factura, formato yyyy-MM-dd
  
    @IsNotEmpty()
    readonly customer: {
      person_type: string;
      id_type: string;
      identification: string;
      name: string[];
      address: {
        address: string;
        city: {
          country_code: string;
          state_code: string;
          city_code: string;
        };
      };
      phones: [
        {
          number: string;
        }
      ];
      contacts: [
        {
          first_name: string;
          last_name: string;
          email: string;
        }
      ];
    };
  
    @IsNumber()
    @IsOptional()
    readonly seller?: number;
  
    @IsNotEmpty()
    readonly stamp: {
      send: boolean; //Envío de factura electrónica TRUE - DIAN.
    };
  
    @IsNotEmpty()
    readonly mail: {
      send: boolean; //Envío de factura electrónica TRUE - Mail a cliente.
    };
  
    @IsString()
    @IsOptional()
    readonly observations?: string;
  
    @IsArray()
    @IsNotEmpty()
    readonly items: Item[];
  
    @IsArray()
    @IsNotEmpty()
    readonly payments: Payment[];
  
    @IsArray()
    @IsNotEmpty()
    readonly globaldiscounts: Discounts[];
  }
  