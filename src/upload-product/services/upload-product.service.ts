import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UploadProduct } from 'src/entities/upload-product.entity'
import { Repository } from 'typeorm'
import {
    CreateUploadProductDTO,
    UpdateUploadProductDTO,
} from '../dtos/upload-product.dto'

@Injectable()
export class UploadProductService {
    constructor(
        @InjectRepository(UploadProduct)
        private uploadProductRepository: Repository<UploadProduct>,
    ) {}

    async findAll(providerId?: number, uploadStatus?: string) {
        let queryBuilder = this.uploadProductRepository
            .createQueryBuilder('uploadProduct')
            .orderBy('uploadProduct.createdAt', 'DESC')
        if (uploadStatus !== undefined) {
            queryBuilder = queryBuilder.where(
                'uploadProduct.status = :uploadStatus',
                {
                    uploadStatus,
                },
            )
        }
        if (providerId !== undefined) {
            queryBuilder = queryBuilder.andWhere(
                'uploadProduct.providerId = :providerId',
                {
                    providerId,
                },
            )
        }
        return await queryBuilder.getMany()
    }

    async findOne(id: number) {
        const product = await this.uploadProductRepository
            .createQueryBuilder('uploadProduct')
            .where('uploadProduct.id = :id', { id })
            .getOne()
        if (!product) {
            throw new NotFoundException(
                `The Product with ID: ${id} was Not Found`,
            )
        }
        return product
    }

    async createEntity(payload: CreateUploadProductDTO) {
        const newProduct = this.uploadProductRepository.create(payload)
        return await this.uploadProductRepository.save(newProduct)
    }

    async updateEntity(id: number, payload: UpdateUploadProductDTO) {
        const product = await this.findOne(id)
        if (!product) {
            throw new NotFoundException(
                `The Product with ID: ${id} was Not Found`,
            )
        }
        this.uploadProductRepository.merge(product, payload)
        return await this.uploadProductRepository.save(product)
    }

    async deleteEntity(id: number) {
        const product = await this.findOne(id)
        if (!product) {
            throw new NotFoundException(
                `The Product with ID: ${id} was Not Found`,
            )
        }
        return await this.uploadProductRepository.softDelete(product.id)
    }
}
