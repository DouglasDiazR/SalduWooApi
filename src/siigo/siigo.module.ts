import { Module } from '@nestjs/common';

import { SiigoController } from './siigo.controller';
import { HttpClientService } from './services/http-client.service';
import { SiigoService } from './services/siigo.service';
import { TaxDiscountService } from './services/tax-discount.service';
import { ChargeService } from './services/charge.service';
import { SalduProductService } from './services/saldu-product.service';

@Module({
  providers: [SiigoService, HttpClientService, TaxDiscountService, ChargeService, SalduProductService],
  controllers: [SiigoController]
})
export class SiigoModule {}
