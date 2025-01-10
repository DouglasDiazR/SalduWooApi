import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadProduct } from 'src/entities/upload-product.entity';
import { Repository } from 'typeorm';
import { CreateUploadProductDTO, UpdateUploadProductDTO } from '../dtos/upload-product.dto';

@Injectable()
export class UploadProductService {
    constructor(
        @InjectRepository(UploadProduct)
        private uploadProductRepository: Repository<UploadProduct>
    ) {}

    async findAll() {}

    async findOne(id: number) {}

    async findAllByProviderId(providerId: number, uploadStatus?: string) {}

    async createEntity(payload: CreateUploadProductDTO) {}

    async updateEntity(id:number, payload: UpdateUploadProductDTO) {}
    
    async deleteEntity(id: number) {}
}
