import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Invoice } from 'src/entities/invoice.entity'
import { Repository } from 'typeorm'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoice.dto'
import { PaymentOptionService } from './payment-option.service'
import { SiigoInvoiceDTO } from '../dtos/siigo-invoice.dto'
import IOrders from 'src/orders/orders.interface'
import { SiigoService } from './siigo.service'
import { SiigoResponseDTO } from '../dtos/siigo-response.dto'
import { InvoiceErrorLogService } from './invoice-error-log.service'
import { CreateInvoiceErrorLogDTO } from '../dtos/invoice-error-log.dto'
import { SalduInlineProduct } from 'src/entities/saldu-inline-product.entity'

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        private paymentOptionService: PaymentOptionService,
        private invoiceErrorLogService: InvoiceErrorLogService,
        private siigoService: SiigoService,
    ) {}

    async findAll(status?: string) {
        let queryBuilder = this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.paymentOption', 'paymentOption')
            .orderBy('invoice.createdAt', 'DESC')
        if (status !== undefined) {
            queryBuilder = queryBuilder.where('invoice.siigoStatus = :status', {
                status,
            })
        }
        return await queryBuilder.getMany()
    }

    async findAllSiigoRejected() {
        const invoices = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.paymentOption', 'paymentOption')
            .leftJoinAndSelect('invoice.errorLogs', 'errorLogs')
            .where('invoice.siigoId is NULL')
            .getMany()
        return invoices
    }

    async findOne(id: number): Promise<Invoice> {
        const invoice = await this.invoiceRepository
            .createQueryBuilder('invoice')
            .leftJoinAndSelect('invoice.paymentOption', 'paymentOption')
            .leftJoinAndSelect('invoice.salduInlineProducts', 'salduInlineProducts')
            .leftJoinAndSelect('salduInlineProducts.salduProduct', 'salduProduct')
            .leftJoinAndSelect('salduProduct.charges', 'charges')
            .leftJoinAndSelect('charges.taxDiscount', 'taxDiscount')
            .where('invoice.id = :id', { id })
            .getOne()
        if (!invoice) {
            throw new NotFoundException(
                `The Invoice with ID: ${id} was Not Found`,
            )
        }
        return invoice
    }

    async createEntity(payload: CreateInvoiceDTO) {
        const newInvoice = this.invoiceRepository.create(payload)
        if (payload.paymentOptionId) {
            newInvoice.paymentOption = await this.paymentOptionService.findOne(
                payload.paymentOptionId,
            )
        }
        return await this.invoiceRepository.save(newInvoice)
    }

    async updateEntity(id: number, payload: UpdateInvoiceDTO) {
        const invoice = await this.findOne(id)
        if (!invoice) {
            throw new NotFoundException(
                `The Invoice with ID: ${id} was Not Found`,
            )
        }
        this.invoiceRepository.merge(invoice, payload)
        return await this.invoiceRepository.save(invoice)
    }

    async siigoInvoiceUpload(invoiceId: number, order: IOrders) {
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
            items: [
                {
                    id: invoice.salduInlineProducts[0].salduProduct.siigoId,
                    code: invoice.salduInlineProducts[0].salduProduct.internalCode,
                    description: invoice.salduInlineProducts[0].salduProduct.description,
                    quantity: 1,
                    taxed_price: invoice.taxedPrice,
                    discount: 0,
                    taxes: [
                        {
                            id: invoice.salduInlineProducts[0].salduProduct.charges[0].taxDiscount
                                .siigoId, //Se van a manejar más de un impuesto por producto?
                        },
                    ],
                },
            ],
            payments: [
                {
                    id: invoice.paymentOption.siigoId,
                    value: invoice.taxedPrice,
                },
            ],
            globaldiscounts: []
        }
        const siigoResponse: SiigoResponseDTO = await this.siigoService.CreateInvoice(siigoInvoiceRequest)
        if (siigoResponse.Errors) {
            console.log(`Siigo Request Rejection - Status: ${siigoResponse.Status}`);
            siigoResponse.Errors.forEach(async error => {
                console.log(`Siigo Error "${error.Code}": ${error.Message}`);
                const errorLog: CreateInvoiceErrorLogDTO = {
                    code: error.Code,
                    message: error.Message,
                    param: error.Params[0].code,
                    invoiceId: invoiceId
                }
                await this.invoiceErrorLogService.createEntity(errorLog)
            });
            return `Invoice ${invoiceId} was Rejected by Siigo`
        } else {
            console.log(`Siigo Invoice Successfully Created - ID: ${siigoResponse.id}`);
            const siigoData: UpdateInvoiceDTO = {
                siigoId: siigoResponse.id,
                siigoStatus: siigoResponse.stamp.status,
                siigoDate: siigoResponse.date,
                siigoName: siigoResponse.name,
                cufe: siigoResponse.stamp.cufe,
                publicUrl: siigoResponse.public_url,
                customerMailed: siigoResponse.mail.status == 'sent' ? true : false
            }
            return await this.updateEntity(invoiceId, siigoData)
        }
    }
}
