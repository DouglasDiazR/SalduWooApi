import { Module } from '@nestjs/common';
import { UploadProductService } from './services/upload-product.service';
import { UploadProductController } from './controllers/upload-product.controller';
import { CsvManagerService } from './services/csv-manager.service';
import { UploadProduct } from 'src/entities/upload-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UploadProduct])],
  providers: [UploadProductService, CsvManagerService],
  controllers: [UploadProductController]
})
export class UploadProductModule {}
