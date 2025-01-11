import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { UploadProductService } from '../services/upload-product.service'
import {
    CreateUploadProductDTO,
    UpdateUploadProductDTO,
} from '../dtos/upload-product.dto'
import { CsvManagerService } from '../services/csv-manager.service'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('upload-product')
export class UploadProductController {
    constructor(
        private uploadProductService: UploadProductService,
        private csvManagerService: CsvManagerService,
    ) {}

    @Get()
    async findAll(
        @Query('providerId') providerId?: string,
        @Query('uploadStatus') uploadStatus?: string,
    ) {
        return await this.uploadProductService.findAll(parseInt(providerId), uploadStatus)
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.uploadProductService.findOne(id)
    }

    @Post()
    createEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUploadProductDTO,
    ) {}

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateUploadProductDTO,
    ) {
        return this.uploadProductService.updateEntity(id, payload)
    }

    @Post('massive-upload/:providerId')
    @UseInterceptors(FileInterceptor('file'))
    async massiveUpload(
        @Param('providerId', ParseIntPipe) providerId: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException(
                'Upload a file to excecute this request',
            )
        }
        const newUpload =
            await this.csvManagerService.processCsvBuffer(file.buffer)

        console.log(newUpload)
        return await this.uploadProductService.massiveUpload(
            providerId,
            newUpload,
        )
    }

    // @Post('rejected-products')
    // async downloadRejectedProducts(@Body() payload: RejectedProductsDTO) {}

    // @Post('accepted-products')
    // async downloadProviderProducts(
    //     @Query('providerId', ParseIntPipe) providerId: number,
    // ) {}
}
