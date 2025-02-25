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

    async createEntity(payload: CreateSalduInlineProductDTO) {
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
                try {
                    const comProd = await this.findByProductIdAndInvoiceId(
                        4,
                        payload.invoiceId,
                    )
                    const payProd = await this.findByProductIdAndInvoiceId(
                        3,
                        payload.invoiceId,
                    )

                    const comission = (comProd?.taxedPrice ?? 0) * 1.19
                    const platform = payProd?.taxedPrice ?? 0

                    inlineProduct.taxedPrice =
                        (inlineProduct.invoice.orderTotal -
                            comission -
                            platform) *
                            0.004 +
                        1800
                    break
                } catch (error) {
                    console.log(error)
                }
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
            return null
        }
        return inlineProduct
    }

    async updateEntity(payload: UpdateSalduInlineProductDTO) {
        let inlineProduct = await this.findByProductIdAndInvoiceId(
            payload.salduProductId,
            payload.invoiceId,
        )
        if (!inlineProduct) {
            throw new NotFoundException(
                `The Inline-Product with ID: ${inlineProduct.id} was Not Found`,
            )
        }
        if (payload.salduProductId == 1) {
            console.log('update 4x1000')
            inlineProduct.taxedPrice =
                (inlineProduct.invoice.orderTotal -
                    (
                        await this.findByProductIdAndInvoiceId(
                            4,
                            payload.invoiceId,
                        )
                    ).taxedPrice *
                        1.19) *
                    0.004 +
                1800
            console.log(inlineProduct.taxedPrice)
        }
        await this.salduInlineProductRepository.merge(inlineProduct, payload)
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
