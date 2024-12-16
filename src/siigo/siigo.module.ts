import { Module } from '@nestjs/common'

import { HttpClientService } from './services/http-client.service'
import { SiigoService } from './services/siigo.service'
import { TaxDiscountService } from './services/tax-discount.service'
import { ChargeService } from './services/charge.service'
import { SalduProductService } from './services/saldu-product.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaxDiscount } from 'src/entities/tax-discount.entity'
import { Charge } from 'src/entities/charge.entity'
import { SalduProduct } from 'src/entities/saldu-products.entity'
import { PaymentOptionService } from './services/payment-option.service'
import { InvoiceErrorLogService } from './services/invoice-error-log.service'
import { InvoiceService } from './services/invoice.service'
import { InvoiceErrorLog } from 'src/entities/invoice-error-log.entity'
import { Invoice } from 'src/entities/invoice.entity'
import { PaymentOption } from 'src/entities/payment-option.entity'

@Module({
    providers: [
        SiigoService,
        HttpClientService,
        TaxDiscountService,
        ChargeService,
        SalduProductService,
        PaymentOptionService,
        InvoiceErrorLogService,
        InvoiceService,
    ],
    controllers: [],
    imports: [
        TypeOrmModule.forFeature([
            Charge,
            Invoice,
            InvoiceErrorLog,
            PaymentOption,
            SalduProduct,
            TaxDiscount,
        ]),
    ],
})
export class SiigoModule {}
