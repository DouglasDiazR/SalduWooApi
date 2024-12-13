import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Invoice } from 'src/entities/invoice.entity'
import { Repository } from 'typeorm'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoice.dto'
import { PaymentOptionService } from './payment-option.service'
import { SiigoInvoiceDTO } from '../dtos/siigo-invoice.dto'
import IOrders from 'src/orders/orders.interface'
import { SiigoService } from './siigo.service'

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        private paymentOptionService: PaymentOptionService,
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
            .leftJoinAndSelect('invoice.salduProdduct', 'salduProdduct')
            .leftJoinAndSelect('salduProdduct.charges', 'charges')
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
        newInvoice.value = payload.orderTotal * 0.1
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

    async siigoInvoiceUpload(payload: Invoice, order: IOrders) {
        const siigoInvoiceRequest: SiigoInvoiceDTO = {
            document: { id: 1111 },
            date: payload.updatedAt.toISOString().substring(0, 10),
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
            seller: 1234, // Cómo se maneja el referente de vendedor
            stamp: { send: true },
            mail: { send: true },
            items: [
                {
                    id: payload.salduProduct.siigoId,
                    code: payload.salduProduct.internalCode,
                    description: payload.salduProduct.description,
                    quantity: 1,
                    taxed_price: payload.value,
                    discount: 0,
                    taxes: [
                        {
                            id: payload.salduProduct.charges[0].taxDiscount
                                .siigoId, //Se van a manejar más de un impuesto por producto?
                        },
                    ],
                },
            ],
            payments: [
                {
                    id: payload.paymentOption.siigoId,
                    value: payload.value,
                },
            ],
            globaldiscounts: []
        }
        const siigoResponse: SiigoResponseDTO = await this.siigoService.CreateInvoice(siigoInvoiceRequest)
    }
}
