import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { SalduInlineProduct } from 'src/entities/saldu-inline-product.entity'
import { Repository } from 'typeorm'
import { InvoiceService } from './invoice.service'
import { SalduProductService } from './saldu-product.service'
import {
    CreateSalduInlineProductDTO,
    UpdateSalduInlineProductDTO,
} from '../dtos/saldu-inline-product.dto'

@Injectable()
export class SalduInlineProductService {
    constructor(
        @InjectRepository(SalduInlineProduct)
        private readonly salduInlineProductRepository: Repository<SalduInlineProduct>,
        private readonly invoiceService: InvoiceService,
        private readonly salduProductService: SalduProductService,
    ) {}

    async createEntity(payload: CreateSalduInlineProductDTO, ) {
        const inlineProduct = this.salduInlineProductRepository.create(payload)
        inlineProduct.invoice = await this.invoiceService.findOne(
            payload.invoiceId,
        )
        inlineProduct.salduProduct = await this.salduProductService.findOne(
            payload.salduProductId,
        )
        switch (payload.salduProductId) {
            case 4:
                inlineProduct.taxedPrice = payload.taxedPrice
                break
            case 2:
                inlineProduct.taxedPrice = payload.taxedPrice
                break
            case 3:
                inlineProduct.taxedPrice = payload.taxedPrice
                break
            case 1:
                inlineProduct.taxedPrice = 1800 + ((inlineProduct.invoice.orderTotal - (await this.findByProductIdAndInvoiceId(4, payload.invoiceId)).taxedPrice) * 1.19 * 4 / 1000)
                break
        }
        return await this.salduInlineProductRepository.save(inlineProduct)
    }

    async findAllByInvoiceId(invoiceId: number) {
        const inlineProducts = await this.salduInlineProductRepository
            .createQueryBuilder('salduInlineProduct')
            .leftJoinAndSelect('salduInlineProduct.invoice', 'invoice')
            .leftJoinAndSelect(
                'salduInlineProduct.salduProduct',
                'salduProduct',
            )
            .leftJoinAndSelect('salduProduct.charges', 'charges')
            .leftJoinAndSelect('charges.taxDiscount', 'taxDiscount')
            .where('invoice.id = :invoiceId', { invoiceId })
            .getMany()
        if (!inlineProducts) {
            throw new NotFoundException(
                `The Inline-Product with ID: ${invoiceId} was Not Found`,
            )
        }
        return inlineProducts
    }

    async findByProductIdAndInvoiceId(
        salduProductId: number,
        invoiceId: number,
    ): Promise<SalduInlineProduct> {
        const inlineProduct = await this.salduInlineProductRepository
            .createQueryBuilder('salduInlineProduct')
            .leftJoinAndSelect('salduInlineProduct.invoice', 'invoice')
            .where('salduInlineProduct.salduProductId = :salduProductId', {
                salduProductId,
            })
            .andWhere('salduInlineProduct.invoiceId = :invoiceId', {
                invoiceId,
            })
            .getOne()
        if (!inlineProduct) {
            throw new NotFoundException(
                `The Inline-Product linked to Product ID: ${salduProductId} and Invoice ID: ${invoiceId} was Not Found`,
            )
        }
        return inlineProduct;
    }

    async updateEntity(payload: UpdateSalduInlineProductDTO) {
        const inlineProduct = await this.findByProductIdAndInvoiceId(
            payload.salduProductId,
            payload.invoiceId,
        )
        if (!inlineProduct) {
            throw new NotFoundException(
                `The Inline-Product with ID: ${inlineProduct.id} was Not Found`,
            )
        }
        if (payload.salduProductId == 1) {
            inlineProduct.taxedPrice = 1800 + ((inlineProduct.invoice.orderTotal - (await this.findByProductIdAndInvoiceId(4, payload.invoiceId)).taxedPrice) * 4 / 1000)
        }
        this.salduInlineProductRepository.merge(inlineProduct, payload)
        return await this.salduInlineProductRepository.save(inlineProduct)
    }

    async deleteEntity(id: number) {
        const target = await this.salduInlineProductRepository.findOneBy({ id })
        if (!target) {
            throw new NotFoundException(
                `The Inline-Product with ID: ${id} was Not Found`,
            )
        }
        return await this.salduInlineProductRepository.softDelete(target.id)
    }
}
