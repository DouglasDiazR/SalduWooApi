import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Charge } from 'src/entities/charge.entity'
import { Repository } from 'typeorm'
import { TaxDiscountService } from './tax-discount.service'
import { SalduProductService } from './saldu-product.service'
import { CreateChargeDTO } from '../dtos/charge.dto'

@Injectable()
export class ChargeService {
    constructor(
        @InjectRepository(Charge)
        private readonly chargeRepository: Repository<Charge>,
        private readonly taxDiscountService: TaxDiscountService,
        private readonly salduProductService: SalduProductService,
    ) {}

    async createEntity(payload: CreateChargeDTO) {
        const charge = this.chargeRepository.create(payload);
        charge.salduProduct = await this.salduProductService.findOne(
            payload.salduProductId,
        )
        charge.taxDiscount = await this.taxDiscountService.findOne(
            payload.taxDiscountId,
        )
        return await this.chargeRepository.save(charge)
    }
}
