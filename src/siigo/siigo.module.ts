import { Module } from '@nestjs/common';

import { SiigoController } from './siigo.controller';
import { HttpClientService } from './services/http-client.service';
import { SiigoService } from './services/siigo.service';
import { TaxDiscountService } from './services/tax-discount.service';

@Module({
  providers: [SiigoService, HttpClientService, TaxDiscountService],
  controllers: [SiigoController]
})
export class SiigoModule {}
