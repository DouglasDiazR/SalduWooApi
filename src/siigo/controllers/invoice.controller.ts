import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoice.dto'
import { InvoiceService } from '../services/invoice.service'
import IOrders from 'src/orders/orders.interface'
import { SalduInlineProductService } from '../services/saldu-inline-product.service'
import { SiigoService } from '../services/siigo.service'
import { SiigoInvoiceDTO } from '../dtos/siigo-invoice.dto'
import { SiigoResponseDTO } from '../dtos/siigo-response.dto'
import { CreateInvoiceErrorLogDTO } from '../dtos/invoice-error-log.dto'
import { InvoiceErrorLogService } from '../services/invoice-error-log.service'

@Controller('invoice')
export class InvoiceController {
    constructor(
        private invoiceService: InvoiceService,
        private invoiceErrorLogService: InvoiceErrorLogService,
        private salduInlineProductService: SalduInlineProductService,
        private siigoService: SiigoService,
    ) {}

    @Post()
    async createEntity(@Body() payload: CreateInvoiceDTO) {
        const newInvoice = await this.invoiceService.createEntity(payload)
        const salduProductIds = [1, 4]
        if (payload.shippingPrice) {
            await this.salduInlineProductService.createEntity({
                taxedPrice: payload.shippingPrice,
                invoiceId: newInvoice.id,
                salduProductId: 3,
            })
        }
        if (payload.paybackPrice) {
            await this.salduInlineProductService.createEntity({
                taxedPrice: payload.paybackPrice,
                invoiceId: newInvoice.id,
                salduProductId: 2,
            })
        }
        for (const prodId of salduProductIds) {
            await this.salduInlineProductService.createEntity({
                invoiceId: newInvoice.id,
                salduProductId: prodId,
            })
        }
        const invoiceProds = await this.salduInlineProductService.findAllByInvoiceId(newInvoice.id)
        let invoiceTotal = 0
        for (const prod of invoiceProds) {
            invoiceTotal += prod.taxedPrice
        }
        return await this.invoiceService.updateEntity(newInvoice.id, { taxedPrice: invoiceTotal })
    }

    @Get()
    findAll(@Query('status') status?: string | undefined) {
        return this.invoiceService.findAll(status)
    }

    @Get()
    findAllSiigoRejected() {
        return this.invoiceService.findAllSiigoRejected()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.findOne(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateInvoiceDTO,
    ) {
        return this.invoiceService.updateEntity(id, payload)
    }

    @Post('siigo/:id')
    async siigoInvoiceUpload(
        @Param('id', ParseIntPipe) invoiceId: number,
        @Body() order: IOrders,
    ) {
        const invoice = await this.findOne(invoiceId)
        const siigoInvoiceRequest: SiigoInvoiceDTO = {
            document: { id: 26375 },
            date: invoice.updatedAt.toISOString().substring(0, 10),
            customer: {
                person_type:
                    order.customer.documentType == 'NIT' ? 'Company' : 'Person',
                id_type: order.customer.documentType == 'NIT' ? '31' : '13',
                identification: order.customer.document,
                name:
                    order.customer.documentType == 'NIT'
                        ? [order.customer.businessName]
                        : [order.customer.firstname, order.customer.lastname],
                address: {
                    address: order.customer.address,
                    city: {
                        country_code: 'CO',
                        state_code: '08',
                        city_code: '08001',
                    },
                },
                phones: [{ number: order.customer.phone }],
                contacts: [
                    {
                        first_name:
                            order.customer.documentType == 'NIT'
                                ? 'No Contact'
                                : order.customer.firstname,
                        last_name:
                            order.customer.documentType == 'NIT'
                                ? 'No Contact'
                                : order.customer.lastname,
                        email: order.customer.email,
                    },
                ],
            },
            seller: 487, // Solo está registrado el usuario de Tatiana
            stamp: { send: true },
            mail: { send: true },
            items: [],
            payments: [
                {
                    id: invoice.paymentOption.siigoId,
                    value: invoice.taxedPrice,
                },
            ],
            globaldiscounts: [],
        }
        const items =
            await this.salduInlineProductService.findAllByInvoiceId(invoiceId)
        for (const item of items) {
            const inlineProduct = {
                id: item.salduProduct.siigoId,
                code: item.salduProduct.internalCode,
                description: item.salduProduct.description,
                quantity: 1,
                taxed_price: item.taxedPrice,
                discount: 0,
                taxes: [],
            }
            for (const tax of item.salduProduct.charges) {
                const taxApplied = { id: tax.taxDiscount.siigoId }
                inlineProduct.taxes.push(taxApplied)
            }
            siigoInvoiceRequest.items.push(inlineProduct)
        }
        const siigoResponse: SiigoResponseDTO =
            await this.siigoService.CreateInvoice(siigoInvoiceRequest)
        if (siigoResponse.Errors) {
            console.log(
                `Siigo Request Rejection - Status: ${siigoResponse.Status}`,
            )
            siigoResponse.Errors.forEach(async (error) => {
                console.log(`Siigo Error "${error.Code}": ${error.Message}`)
                const errorLog: CreateInvoiceErrorLogDTO = {
                    code: error.Code,
                    message: error.Message,
                    param: error.Params[0].code,
                    invoiceId: invoiceId,
                }
                await this.invoiceErrorLogService.createEntity(errorLog)
            })
            return `Invoice ${invoiceId} was Rejected by Siigo`
        } else {
            console.log(
                `Siigo Invoice Successfully Created - ID: ${siigoResponse.id}`,
            )
            const siigoData: UpdateInvoiceDTO = {
                siigoId: siigoResponse.id,
                siigoStatus: siigoResponse.stamp.status,
                siigoDate: siigoResponse.date,
                siigoName: siigoResponse.name,
                cufe: siigoResponse.stamp.cufe,
                publicUrl: siigoResponse.public_url,
                customerMailed:
                    siigoResponse.mail.status == 'sent' ? true : false,
            }
            return await this.updateEntity(invoiceId, siigoData)
        }
    }
}
