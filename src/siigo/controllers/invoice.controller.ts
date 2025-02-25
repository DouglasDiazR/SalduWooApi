import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
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
import { OrdersService } from 'src/orders/orders.service'
import { CreatePendingInvoiceDTO } from '../dtos/pending-invoice.dto'
import { Status } from 'src/enum/status.enum'
import { Invoice } from 'src/entities/invoice.entity'
import { log } from 'console'
import { FileInterceptor } from '@nestjs/platform-express'
import { S3Service } from '../services/s3.service'

@Controller('invoice')
export class InvoiceController {
    constructor(
        private invoiceService: InvoiceService,
        private invoiceErrorLogService: InvoiceErrorLogService,
        private salduInlineProductService: SalduInlineProductService,
        private siigoService: SiigoService,
        private orderService: OrdersService,
        private s3Service: S3Service
    ) {}

    @Post()
    async createEntity(@Body() payload: CreateInvoiceDTO) {
        const newInvoice = await this.invoiceService.createEntity(payload)
        if (payload.shippingPrice && payload.shippingPrice > 0) {
            await this.salduInlineProductService.createEntity({
                taxedPrice: payload.shippingPrice,
                invoiceId: newInvoice.id,
                salduProductId: 2,
            })
        }
        if (payload.paybackPrice && payload.paybackPrice > 0) {
            await this.salduInlineProductService.createEntity({
                taxedPrice: payload.paybackPrice,
                invoiceId: newInvoice.id,
                salduProductId: 3,
            })
        }
        await this.salduInlineProductService.createEntity({
            invoiceId: newInvoice.id,
            salduProductId: 4,
            taxedPrice: payload.commission ? payload.commission : 0,
        })
        await this.salduInlineProductService.createEntity({
            invoiceId: newInvoice.id,
            salduProductId: 1,
        })
        const invoiceProds =
            await this.salduInlineProductService.findAllByInvoiceId(
                newInvoice.id,
            )
        let invoiceTotal = 0
        if (invoiceProds.length > 0) {
            for (const prod of invoiceProds) {
                invoiceTotal +=
                    prod.taxedPrice *
                    (1 + prod.salduProduct.charges[0].taxDiscount.value)
            }
        }
        invoiceTotal = parseFloat(invoiceTotal.toFixed(2))
        return await this.invoiceService.updateEntity(newInvoice.id, {
            taxedPrice: invoiceTotal,
        })
    }

    @Get()
    findAll(@Query('status') status?: string | undefined) {
        return this.invoiceService.findAll(status)
    }

    @Get('siigo-generated')
    findAllSiigoGenerated() {
        return this.invoiceService.findAllSiigoGenerated()
    }

    @Get('siigo-rejected')
    findAllSiigoRejected() {
        return this.invoiceService.findAllSiigoRejected()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.findOne(id)
    }

    @Put(':id')
    async updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateInvoiceDTO,
    ) {
        const invoice = await this.invoiceService.findOne(id)
        if (payload.commission && payload.commission > 0) {
            const commission =
                await this.salduInlineProductService.findByProductIdAndInvoiceId(
                    4,
                    id,
                )
            if (!commission) {
                await this.salduInlineProductService.createEntity({
                    invoiceId: id,
                    salduProductId: 4,
                    taxedPrice: payload.commission,
                })
                await this.salduInlineProductService.createEntity({
                    invoiceId: id,
                    salduProductId: 1,
                })
            } else {
                console.log('update path')
                await this.salduInlineProductService.updateEntity({
                    invoiceId: id,
                    salduProductId: 4,
                    taxedPrice: payload.commission,
                })
                await this.salduInlineProductService.updateEntity({
                    invoiceId: id,
                    salduProductId: 1,
                })
            }
        }
        const invoiceProds =
            await this.salduInlineProductService.findAllByInvoiceId(invoice.id)
        let invoiceTotal = 0
        if (invoiceProds.length > 0) {
            for (const prod of invoiceProds) {
                invoiceTotal +=
                    prod.taxedPrice *
                    (1 + prod.salduProduct.charges[0].taxDiscount.value)
            }
        }
        invoiceTotal = Math.floor(invoiceTotal * 100) / 100
        invoice.taxedPrice = invoiceTotal
        return this.invoiceService.updateEntity(id, invoice)
    }

    @Post('all-pending')
    async getAllPending(@Body() payload: CreatePendingInvoiceDTO) {
        let pendingOrders: Invoice[] = []
        const orders = await this.orderService.getAllOrders({
            status: Status.Entregado,
            startDate: payload.startDate,
            endDate: payload.endDate,
        })
        for (const order of orders) {
            const invoice = await this.invoiceService.findOneByOrderId(order.id)
            if (!invoice) {
                const wooOrder = await this.orderService.getOrderById(order.id)
                const newInvoiceDTO: CreateInvoiceDTO = {
                    orderId: wooOrder.id,
                    orderTotal: wooOrder.total,
                    documentType: wooOrder.invoicing.documentType,
                    document: wooOrder.invoicing.document,
                    businessName: wooOrder.invoicing.businessName || '',
                    firstname: wooOrder.invoicing.firstname || '',
                    lastname: wooOrder.invoicing.lastname || '',
                    address: wooOrder.invoicing.address || '',
                    phone: wooOrder.invoicing.phone,
                    email: wooOrder.invoicing.email,
                    orderDate: wooOrder.date_modified,
                    commission: parseFloat(wooOrder.invoicing.commission) || 0,
                    shippingPrice:
                        parseFloat(wooOrder.invoicing.shippingPrice) || 0,
                    paybackPrice:
                        parseFloat(wooOrder.invoicing.payBackPrice) || 0,
                    paymentOptionId: 1,
                }
                pendingOrders.push(await this.createEntity(newInvoiceDTO))
            } else {
                pendingOrders.push(invoice)
            }
        }
        return pendingOrders.filter(
            (order) =>
                order.siigoStatus === 'Error Siigo' ||
                order.siigoStatus === 'Pendiente de Facturar',
        )
    }

    @Post('siigo/:id')
    async siigoInvoiceUpload(@Param('id', ParseIntPipe) invoiceId: number) {
        const invoice = await this.findOne(invoiceId)
        const siigoInvoiceRequest: SiigoInvoiceDTO = {
            document: { id: 26375 }, //Sandbox: 28006 - SalduNube: 26375
            date: new Date().toISOString().substring(0, 10),
            customer: {
                person_type:
                    invoice.documentType == 'NIT' ? 'Company' : 'Person',
                id_type: invoice.documentType == 'NIT' ? '31' : '13',
                identification: invoice.document.split('-')[0],
                name:
                    invoice.documentType == 'NIT'
                        ? [invoice.businessName]
                        : [invoice.firstname, invoice.lastname],
                address: {
                    address: invoice.address,
                    city: {
                        country_code: 'CO',
                        state_code: '08',
                        city_code: '08001',
                    },
                },
                phones: [{ number: invoice.phone.replace(/\D/g, '') }],
                contacts: [
                    {
                        first_name:
                            invoice.documentType == 'NIT'
                                ? 'No Contact'
                                : invoice.firstname,
                        last_name:
                            invoice.documentType == 'NIT'
                                ? 'No Contact'
                                : invoice.lastname,
                        email: invoice.email,
                    },
                ],
            },
            seller: 487, // Sandbox 841 - SalduNube 487 (Tatiana)
            stamp: { send: false },
            mail: { send: false },
            observations: `Factura comisión por uso de plataforma SALDU. Pedidos no. ${invoice.orderId}. \n SALDU pertenece al régimen común. \n Los conceptos de reintegro de costos de transacción corresponden a los gastos bancarios incurridos por Saldu para la operación de recaudo.\n`,
            items: [],
            payments: [
                {
                    id: invoice.paymentOption.siigoId, // Sandbox 7649 - SalduNube 7706
                    value: parseFloat(invoice.taxedPrice.toFixed(2)),
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
                quantity: 1,
                taxed_price: parseFloat(
                    (
                        item.taxedPrice *
                        (1 + item.salduProduct.charges[0].taxDiscount.value)
                    ).toFixed(2),
                ),
                discount: 0,
                taxes: [],
            }
            if (item.salduProduct.id == 3) {
                siigoInvoiceRequest.observations += `Los conceptos de reintegro de costos de transacción corresponden al uso de plataforma de pago ePayCo.`
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
            siigoResponse.Errors.forEach(async (error) => {
                const errorLog: CreateInvoiceErrorLogDTO = {
                    code: error.Code,
                    message: error.Message,
                    param: error.Params[0],
                    invoiceId: invoice.id,
                }
                await this.invoiceService.updateEntity(invoice.id, {
                    siigoStatus: `Error Siigo`,
                })
                try {
                    await this.invoiceErrorLogService.createEntity(errorLog)
                } catch (error) {
                    console.log(error)
                }
            })
            return `Invoice ${invoiceId} was Rejected by Siigo`
        } else {
            const siigoData: UpdateInvoiceDTO = {
                siigoId: siigoResponse.id,
                siigoStatus: siigoResponse.stamp.status,
                siigoDate: siigoResponse.date,
                siigoName: siigoResponse.name,
                //cufe: siigoResponse.id,
                publicUrl: siigoResponse.public_url,
                customerMailed:
                    siigoResponse.mail.status == 'sent' ? true : false,
            }
            //await this.orderService.updateOrder(invoice.orderId, 'completado')
            return await this.invoiceService.updateEntity(invoiceId, siigoData)
        }
    }

    @Post('s3-disp/:providerId/:orderId/:invoiceId')
    @UseInterceptors(FileInterceptor('file'))
    async disperssionFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('providerId', ParseIntPipe) providerId: number,
        @Param('invoiceId', ParseIntPipe) invoiceId: number,
    ) {
        if (!file.mimetype.startsWith('image/') && !file.mimetype.startsWith('application/pdf')) {
            throw new BadRequestException('El archivo debe ser una imagen o un PDF.')
        }
        const bucketName = process.env.AWS_S3_BUCKET_NAME
        const url = await this.s3Service.uploadDisperssionFile(
            providerId,
            orderId,
            file,
            bucketName,
        )
        await this.invoiceService.updateEntity(invoiceId, {
            disperssionUrl: url,
        })
        return { url }
    }

    @Delete(':id')
    async softDeleteInvoice(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.softDeleteEntity(id)
    }
}
