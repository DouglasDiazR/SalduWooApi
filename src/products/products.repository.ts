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
        return this.productsRepository.find()
    }

    async getProductsByUser(id: number) {
        return this.productsRepository.find({ where: { user: { id_wooCommerce: id } } });
    }

    async getProductById(id: number) {
        return this.productsRepository.findOne({ where: { id } });
    }

    async updateProduct(id: number, updateProductDto: any) {
        return this.productsRepository.update(id, updateProductDto);
    }
}
