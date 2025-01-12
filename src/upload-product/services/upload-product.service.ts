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

    async findAll(providerId?: string, uploadStatus?: string) {
        const queryBuilder = this.uploadProductRepository
            .createQueryBuilder('uploadProduct')
            .orderBy('uploadProduct.createdAt', 'DESC')

        // Agregar filtro por uploadStatus
        if (uploadStatus === 'seleccionada') {
            queryBuilder.where('uploadProduct.imagesUrl IS NOT NULL')
        } else if (uploadStatus === 'no seleccionada') {
            queryBuilder.where('uploadProduct.imagesUrl IS NULL')
        }

        // Agregar filtro por providerId
        if (providerId !== undefined) {
            queryBuilder.andWhere('uploadProduct.providerId = :providerId', {
                providerId: parseInt(providerId)
            })
        }

        return queryBuilder.getMany()
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

    async massiveUpload(providerId: number, payload: CreateUploadProductDTO[]) {
        const processedProducts = []
        const rejectedProducts = []

        for (const product of payload) {
            try {
                let newProduct = this.uploadProductRepository.create(product)
                newProduct.providerId = providerId
                newProduct = await this.uploadProductRepository.save(newProduct)
                processedProducts.push(newProduct)
            } catch (error) {
                rejectedProducts.push({
                    product,
                    reason: error.message || 'Unknown error',
                })
            }
        }
        return {
            total: payload.length,
            processed: processedProducts.length,
            rejected: rejectedProducts.length,
            rejectedProducts,
        }
    }
}
