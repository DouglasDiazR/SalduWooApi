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
import { TaxDiscountController } from './controllers/tax-discount.controller'
import { PaymentOptionController } from './controllers/payment-option.controller'
import { SalduProductController } from './controllers/saldu-product.controller'
import { ChargeController } from './controllers/charge.controller'
import { InvoiceErrorLogController } from './controllers/invoice-error-log.controller'
import { InvoiceController } from './controllers/invoice.controller'
import { SalduInlineProduct } from 'src/entities/saldu-inline-product.entity'
import { SalduInlineProductService } from './services/saldu-inline-product.service'

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
        SalduInlineProductService,
    ],
    controllers: [
        TaxDiscountController,
        PaymentOptionController,
        SalduProductController,
        ChargeController,
        InvoiceErrorLogController,
        InvoiceController,
    ],
    imports: [
        TypeOrmModule.forFeature([
            Charge,
            Invoice,
            InvoiceErrorLog,
            PaymentOption,
            SalduProduct,
            SalduInlineProduct,
            TaxDiscount,
        ]),
    ],
})
export class SiigoModule {}
