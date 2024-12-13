import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { PaymentOption } from 'src/entities/payment-option.entity'
import { Repository } from 'typeorm'
import {
    CreatePaymentOptionDTO,
    UpdatePaymentOptionDTO,
} from '../dtos/payment-option.dto'

@Injectable()
export class PaymentOptionService {
    constructor(
        @InjectRepository(PaymentOption)
        private readonly paymentOptionRepository: Repository<PaymentOption>,
    ) {}

    async createEntity(payload: CreatePaymentOptionDTO) {
        return await this.paymentOptionRepository.save(payload)
    }

    async findAll() {
        return await this.paymentOptionRepository.find()
    }

    async findOne(id: number): Promise<PaymentOption> {
        const paymentOption = await this.paymentOptionRepository
            .createQueryBuilder('paymentOption')
            .where('paymentOption.id = :id', { id })
            .getOne()
        if (!paymentOption) {
            throw new NotFoundException(
                `The Payment Option with ID: ${id} was Not Found`,
            )
        }
        return paymentOption
    }

    async updateEntity(id: number, payload: UpdatePaymentOptionDTO) {
        const paymentOption = await this.paymentOptionRepository.findOneBy({
            id,
        })
        if (!paymentOption) {
            throw new NotFoundException(
                `The Payment Option with ID: ${id} was Not Found`,
            )
        }
        this.paymentOptionRepository.merge(paymentOption, payload)
        return await this.paymentOptionRepository.save(paymentOption)
    }

    async deleteEntity(id: number) {
        const target = await this.paymentOptionRepository.findOneBy({ id })
        if (!target) {
            throw new NotFoundException(
                `The Payment Option with ID: ${id} was Not Found`,
            )
        }
        return await this.paymentOptionRepository.softDelete(target.id)
    }
}
