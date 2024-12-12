import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { TaxDiscount } from 'src/entities/tax-discount.entity'
import { Repository } from 'typeorm'
import {
    CreateTaxDiscountDTO,
    UpdateTaxDiscountDTO,
} from '../dtos/tax-discount.dto'
import { Charge } from 'src/entities/charge.entity'

@Injectable()
export class TaxDiscountService {
    constructor(
        @InjectRepository(TaxDiscount)
        private taxDiscountRepository: Repository<TaxDiscount>,
        @InjectRepository(Charge)
        private chargeRepository: Repository<Charge>,
    ) {}

    async findAll() {
        return await this.taxDiscountRepository.find()
    }

    async findOne(id: number): Promise<TaxDiscount> {
        const taxDiscount = await this.taxDiscountRepository
            .createQueryBuilder('taxDiscount')
            .where('taxDiscount.id = :id', { id })
            .getOne()
        if (!taxDiscount) {
            throw new NotFoundException(
                `The Tax or Discount with ID: ${id} was Not Found`,
            )
        }
        return taxDiscount
    }

    async createEntity(payload: CreateTaxDiscountDTO) {
        const newTaxDiscount = this.taxDiscountRepository.create(payload)
        return await this.taxDiscountRepository.save(newTaxDiscount)
    }

    async updateEntity(id: number, payload: UpdateTaxDiscountDTO) {
        const taxDiscount = await this.taxDiscountRepository.findOneBy({ id })
        if (!taxDiscount) {
            throw new NotFoundException(
                `The Tax or Discount with ID: ${id} was Not Found`,
            )
        }
        this.taxDiscountRepository.merge(taxDiscount, payload)
        return await this.taxDiscountRepository.save(taxDiscount)
    }

    async deleteEntity(id: number) {
        const target = await this.taxDiscountRepository.findOne({
            relations: ['charges'],
            where: { id },
        });
        if (!target) {
            throw new NotFoundException(
                `The Tax/Discount with ID: ${id} was Not Found`,
            );
        }
    
        await Promise.all(
            target.charges.map(async (charge) => {
                await this.chargeRepository.softDelete(charge.id);
            }),
        );
    
        return await this.taxDiscountRepository.softDelete(id);
    }
}
