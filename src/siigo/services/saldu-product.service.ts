import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SalduProduct } from 'src/entities/saldu-products.entity'
import { Repository } from 'typeorm'
import {
    CreateSalduProductDTO,
    UpdateSalduProductDTO,
} from '../dtos/saldu-product.dto'
import { Charge } from 'src/entities/charge.entity'

@Injectable()
export class SalduProductService {
    constructor(
        @InjectRepository(SalduProduct)
        private readonly salduProductRepository: Repository<SalduProduct>,
        @InjectRepository(Charge)
        private chargeRepository: Repository<Charge>,
    ) {}

    async findOne(id: number): Promise<SalduProduct> {
        const product = await this.salduProductRepository
            .createQueryBuilder('salduProduct')
            .leftJoinAndSelect('salduProduct.charges', 'charges')
            .leftJoinAndSelect('charges.taxDiscount', 'taxDiscount')
            .where('salduProduct.id = :id', { id })
            .getOne()
        if (!product) {
            throw new NotFoundException(
                `The Saldu-Product with ID: ${id} was Not Found`,
            )
        }
        return product
    }

    async findAll() {
        return await this.salduProductRepository
            .createQueryBuilder('salduProduct')
            .leftJoinAndSelect('salduProduct.charges', 'charges')
            .leftJoinAndSelect('charges.taxDiscount', 'taxDiscount')
            .orderBy('salduProduct.createdAt', 'DESC')
            .getMany()
    }

    async createEntity(payload: CreateSalduProductDTO) {
        try {
            const newProduct = await this.salduProductRepository.save(payload)
            return newProduct
        } catch (error) {
            throw new Error(error)
        }
    }

    async updateEntity(id: number, payload: UpdateSalduProductDTO) {
        const product = await this.salduProductRepository.findOneBy({ id })
        if (!product) {
            throw new NotFoundException(
                `The Product with ID: ${id} was Not Found`,
            )
        }
        await this.salduProductRepository.merge(product, {
            ...payload,
        })
        return await this.salduProductRepository.save(product)
    }

    async deleteEntity(id: number) {
        const target = await this.salduProductRepository.findOne({
            where: { id },
            relations: ['charges'],
        })
        if (!target) {
            throw new NotFoundException(
                `The Product with ID: ${id} was Not Found`,
            )
        }
        await Promise.all(
            target.charges.map(async (charge) => {
                await this.chargeRepository.softDelete(charge.id)
            }),
        )
        return await this.salduProductRepository.softDelete(target.id)
    }
}
