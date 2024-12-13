import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { InvoiceErrorLog } from 'src/entities/invoice-error-log.entity'
import { Repository } from 'typeorm'
import {
    CreateInvoiceErrorLogDTO,
    UpdateInvoiceErrorLogDTO,
} from '../dtos/invoice-error-log.dto'

@Injectable()
export class InvoiceErrorLogService {
    constructor(
        @InjectRepository(InvoiceErrorLog)
        private invoiceErrorLogRepository: Repository<InvoiceErrorLog>,
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
        const errorLog = await this.invoiceErrorLogRepository
            .createQueryBuilder('invoiceErrorLog')
            .leftJoinAndSelect('invoiceErrorLog.invoice', 'invoice')
            .where('invoice.id = :id', { id })
            .getMany()
    }

    async findByInvoiceSiigoId(id: string) {
        const errorLog = await this.invoiceErrorLogRepository
            .createQueryBuilder('invoiceErrorLog')
            .leftJoinAndSelect('invoiceErrorLog.invoice', 'invoice')
            .where('invoice.siigoId = :id', { id })
            .getMany()
    }

    async createEntity(payload: CreateInvoiceErrorLogDTO) {
        return await this.invoiceErrorLogRepository.save(payload)
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
