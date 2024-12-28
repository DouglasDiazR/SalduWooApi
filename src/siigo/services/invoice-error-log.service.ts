import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceErrorLog } from 'src/entities/invoice-error-log.entity'
import { Repository } from 'typeorm'
import {
    CreateInvoiceErrorLogDTO,
    UpdateInvoiceErrorLogDTO,
} from '../dtos/invoice-error-log.dto'
import { Invoice } from 'src/entities/invoice.entity'

@Injectable()
export class InvoiceErrorLogService {
    constructor(
        @InjectRepository(InvoiceErrorLog)
        private invoiceErrorLogRepository: Repository<InvoiceErrorLog>,
        @InjectRepository(Invoice)
        private invoiceRepository: Repository<Invoice>,
    ) {}

    async findAll() {
        return await this.invoiceErrorLogRepository.find({
            order: {
                createdAt: 'DESC',
            },
        })
    }

    async findOne(id: number): Promise<InvoiceErrorLog> {
        const errorLog = await this.invoiceErrorLogRepository
            .createQueryBuilder('invoiceErrorLog')
            .where('invoiceErrorLog.id = :id', { id })
            .getOne()
        if (!errorLog) {
            throw new NotFoundException(
                `The Error Log with ID: ${id} was Not Found`,
            )
        }
        return errorLog
    }

    async findByInvoiceId(id: number) {
        const errorLogs = await this.invoiceErrorLogRepository
            .createQueryBuilder('invoiceErrorLog')
            .leftJoinAndSelect('invoiceErrorLog.invoice', 'invoice')
            .where('invoice.id = :id', { id })
            .getMany()
        return errorLogs
    }

    async findByInvoiceSiigoId(id: string) {
        const errorLog = await this.invoiceErrorLogRepository
            .createQueryBuilder('invoiceErrorLog')
            .leftJoinAndSelect('invoiceErrorLog.invoice', 'invoice')
            .where('invoice.siigoId = :id', { id })
            .getMany()
    }

    async createEntity(payload: CreateInvoiceErrorLogDTO) {
        const errorLog = await this.invoiceErrorLogRepository.create(payload);
        errorLog.invoice = await this.invoiceRepository.findOneBy({id: payload.invoiceId})
        return await this.invoiceErrorLogRepository.save(errorLog)
    }

    async updateEntity(id: number, payload: UpdateInvoiceErrorLogDTO) {
        const errorLog = await this.invoiceErrorLogRepository.findOneBy({
            id,
        })
        if (!errorLog) {
            throw new NotFoundException(
                `The Error Log with ID: ${id} was Not Found`,
            )
        }
        this.invoiceErrorLogRepository.merge(errorLog, payload)
        return await this.invoiceErrorLogRepository.save(errorLog)
    }

    async deleteEntity(id: number) {
        const target = await this.invoiceErrorLogRepository.findOneBy({ id })
        if (!target) {
            throw new NotFoundException(
                `The Error Log with ID: ${id} was Not Found`,
            )
        }
        return await this.invoiceErrorLogRepository.softDelete(target.id)
    }
}
