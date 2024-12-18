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
import { SalduInlineProductService } from './saldu-inline-product.service'

@Injectable()
export class InvoiceService {
    constructor(
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
        private paymentOptionService: PaymentOptionService,
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
            .leftJoinAndSelect(
                'invoice.salduInlineProducts',
                'salduInlineProducts',
            )
            .leftJoinAndSelect(
                'salduInlineProducts.salduProduct',
                'salduProduct',
            )
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
}
