import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Products } from 'src/entities/products.entity'
import { Repository } from 'typeorm'

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Products)
        private productsRepository: Repository<Products>,
    ) {}

    async getAllProducts( page : number , limit : number ) {
        return await this.productsRepository.findAndCount({ 
            take: limit, 
            skip: (page - 1) * limit
        })
    }

    async getOneProduct(id: number) {
        return await this.productsRepository.findOneBy({ id })
    }

    async getProductsByUser( vendorId : number , page : number , limit : number ) {
        return await this.productsRepository.findAndCount({
            where: { user: { id_wooCommerce: vendorId } },
            take: limit,
            skip: (page - 1) * limit,
        })
    }

    async createProduct(product: any) {
        return await this.productsRepository.save(product)
    }

    async updateProduct(id: number, updateProductDto: any) {
        return await this.productsRepository.update(id, updateProductDto)
    }

    async activateProduct(id: number) {
        return await this.productsRepository.update(id, { status: 'publish' })
    }

    async deleteProduct(id: number) {
        return await this.productsRepository.update(id, { status: 'draft' })
    }
}
