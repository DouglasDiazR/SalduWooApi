import { Module } from '@nestjs/common'
import { UploadProductService } from './services/upload-product.service'
import { UploadProductController } from './controllers/upload-product.controller'
import { CsvManagerService } from './services/csv-manager.service'
import { UploadProduct } from 'src/entities/upload-product.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Load } from 'src/entities/load.entity'
import { S3Service } from './services/s3.service'
import { MulterModule } from '@nestjs/platform-express'
import * as multer from 'multer';

@Module({
    imports: [
        TypeOrmModule.forFeature([UploadProduct, Load]),
        MulterModule.register({ storage: multer.memoryStorage() }),
    ],
    providers: [UploadProductService, CsvManagerService, S3Service],
    controllers: [UploadProductController],
})
export class UploadProductModule {}
