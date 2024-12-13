import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Charge } from 'src/entities/charge.entity'
import { Repository } from 'typeorm'
import { TaxDiscountService } from './tax-discount.service'
import { SalduProductService } from './saldu-product.service'
import { CreateChargeDTO, UpdateChargeDTO } from '../dtos/charge.dto'

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
        );
        charge.taxDiscount = await this.taxDiscountService.findOne(
            payload.taxDiscountId,
        );
        return await this.chargeRepository.save(charge);
    }

    async findAllByProductId(productId: number) {
        const charges = await this.chargeRepository
            .createQueryBuilder('charge')
            .leftJoinAndSelect('charge.taxDiscount', 'taxDiscount')
            .leftJoinAndSelect('charge.salduProduct', 'salduProduct')
            .where('salduProduct.id = :productId', { productId })
            .getMany();
        if (!charges) {
            throw new NotFoundException(
                `The charge with ID: ${productId} was Not Found`,
            );
        }
        return charges;
    }

    async findByProductIdAndTaxDiscountId(
        productId: number,
        taxDiscountId: number,
    ): Promise<Charge> {
        const charge = await this.chargeRepository
            .createQueryBuilder('charge')
            .where('charge.salduProductId = :salduProductId', {
                productId: productId,
            })
            .andWhere('charge.taxDiscountId = :taxDiscountId', {
                taxDiscountId: taxDiscountId,
            })
            .getOne();
        if (!charge) {
            throw new NotFoundException(
                `The Charge linked to Product ID: ${productId} and Tax or Discount ID: ${taxDiscountId} was Not Found`,
            );
        }
        return charge;
    }

    async updateEntity(payload: UpdateChargeDTO) {
        const charge = await this.findByProductIdAndTaxDiscountId(
            payload.salduProductId,
            payload.taxDiscountId,
        );
        if (!charge) {
            throw new NotFoundException(
                `The Charge with ID: ${charge.id} was Not Found`,
            );
        }
        this.chargeRepository.merge(charge, payload)
        return await this.chargeRepository.save(charge);
    }

    async deleteEntity(id: number) {
        const target = await this.chargeRepository.findOneBy({ id })
        if (!target) {
            throw new NotFoundException(
                `The Charge with ID: ${id} was Not Found`,
            );
        }
        return await this.chargeRepository.softDelete(target.id);
    }
}
