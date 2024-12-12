import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SalduProduct } from 'src/entities/saldu-products.entity'
import { Repository } from 'typeorm'

@Injectable()
export class SalduProductService {
    constructor(
        @InjectRepository(SalduProduct)
        private readonly salduProductRepository: Repository<SalduProduct>,
    ) {}

    async findOne(id: number): Promise<SalduProduct> {
        const product = await this.salduProductRepository
            .createQueryBuilder('salduProduct')
            .where('salduProduct.id = :id', { id })
            .getOne();
        if (!product) {
            throw new NotFoundException(
                `The Saldu-Product with ID: ${id} was Not Found`,
            )
        }
        return product
    }
}
