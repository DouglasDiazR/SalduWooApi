import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Products } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsRepository {
    constructor(
        @InjectRepository(Products) private productsRepository: Repository<Products>,
    ) {}

    async getAllProducts() {
        return await this.productsRepository.find()
    }

    async getProductsByUser(id: number) {
        return await this.productsRepository.find({ where: { user: { id_wooCommerce: id } } });
    }

    async createProduct(product: any) {
        return await this.productsRepository.save(product);
    }

    async updateProduct(id: number, updateProductDto: any) {
        return await this.productsRepository.update(id, updateProductDto);
    }

    async deleteProduct(id: number) {
        return await this.productsRepository.update(id, { status: 'draft' });
    }
}
