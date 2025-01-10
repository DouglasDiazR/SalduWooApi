import { Module } from '@nestjs/common';
import { UploadProductService } from './services/upload-product.service';

@Module({
  providers: [UploadProductService]
})
export class UploadProductModule {}
