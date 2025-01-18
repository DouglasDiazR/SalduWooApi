import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UploadProduct } from 'src/entities/upload-product.entity'
import { Repository } from 'typeorm'
import {
    CreateUploadProductDTO,
    UpdateUploadProductDTO,
} from '../dtos/upload-product.dto'
import { Load } from 'src/entities/load.entity'

@Injectable()
export class UploadProductService {
    constructor(
        @InjectRepository(UploadProduct)
        private uploadProductRepository: Repository<UploadProduct>,
        @InjectRepository(Load)
        private loadRepository: Repository<Load>,
    ) {}

    async findAll(providerId?: string, uploadStatus?: string, loadId?: string) {
        const queryBuilder = this.uploadProductRepository
            .createQueryBuilder('uploadProduct')
            .orderBy('uploadProduct.createdAt', 'DESC')

        if (uploadStatus === 'seleccionada') {
            queryBuilder.where('uploadProduct.imagesUrl IS NOT NULL')
        } else if (uploadStatus === 'no_seleccionada') {
            queryBuilder.where('uploadProduct.imagesUrl IS NULL')
        }

        if (providerId !== undefined) {
            queryBuilder.andWhere('uploadProduct.providerId = :providerId', {
                providerId: parseInt(providerId),
            })
        }
        if (loadId !== undefined) {
            queryBuilder.andWhere('uploadProduct.loadId = :loadId', {
                loadId: parseInt(loadId),
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

    async updateOneBySalduSKU(payload: UpdateUploadProductDTO) {
        const product = await this.uploadProductRepository
            .createQueryBuilder('uploadProduct')
            .where('uploadProduct.skuSaldu = :sku', { sku: payload.skuSaldu })
            .getOne()
        if (!product) {
            throw new NotFoundException(
                `The Product with SKU: ${payload.skuSaldu} was Not Found`,
            )
        }
        this.uploadProductRepository.merge(product, payload)
        return await this.uploadProductRepository.save(product)
    }


    async findAllProviderLoads(providerId: number) {
        const queryBuilder = this.loadRepository
            .createQueryBuilder('load')
            .where('load.providerId = :providerId', { providerId })
        return queryBuilder.getMany()
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

    async massiveUpload(providerId: string, payload: CreateUploadProductDTO[]) {
        const processedProducts = []
        const rejectedProducts = []
        const load = await this.loadRepository.save({
            providerId: parseInt(providerId, 10),
            reference: `${providerId}_${new Date().toUTCString()}`,
        })

        for (const product of payload) {
            try {
                let newProduct = this.uploadProductRepository.create(product)
                newProduct.providerId = parseInt(providerId, 10)
                newProduct.load = load
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
            load: load,
            total: payload.length,
            processed: processedProducts.length,
            rejected: rejectedProducts.length,
            rejectedProducts,
        }
    }
}
