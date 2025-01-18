import {
    BadRequestException,
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Res,
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
import { Response } from 'express'
import { UploadProduct } from 'src/entities/upload-product.entity'

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
        @Query('loadId') load?: string,
    ) {
        return await this.uploadProductService.findAll(
            providerId,
            uploadStatus,
            load,
        )
    }

    @Get('loads/:providerId')
    async findLoads(@Param('providerId', ParseIntPipe) providerId: number) {
        return await this.uploadProductService.findAllProviderLoads(providerId)
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
        @Param('providerId') providerId: string,
        @UploadedFile() file: Express.Multer.File,
    ) {
        if (!providerId || providerId == '' || providerId == 'default') {
            throw new BadRequestException({
                trigger: 'providerId',
                message: 'This request needs a Selected Provider',
            })
        }
        if (!file) {
            throw new BadRequestException({
                trigger: 'file',
                message: 'This request needs a Product Provider .csv file',
            })
        }
        const newUpload = await this.csvManagerService.processCsvBuffer(
            file.buffer,
        )
        return await this.uploadProductService.massiveUpload(
            providerId,
            newUpload,
        )
    }

    @Post('massive-upload/rejected')
    async massiveUploadRejected(
        @Body() rejectedProds: UploadProduct[],
        @Res() response: Response,
    ) {
        response.setHeader('Content-Type', 'text/csv')
        response.setHeader(
            'Content-Disposition',
            'attachment; filename="upload-products.csv"',
        )
        const csvStream =
            this.csvManagerService.processEntityToCsv(rejectedProds)
        csvStream.pipe(response)
    }

    @Get(':providerId/:uploadStatus/csv')
    async downloadProducts(
        @Param('providerId') providerId: string,
        @Param('uploadStatus') uploadStatus: string,
        @Res() response: Response,
    ) {
        response.setHeader('Content-Type', 'text/csv')
        response.setHeader(
            'Content-Disposition',
            'attachment; filename="upload-products.csv"',
        )
        let products = await this.findAll(providerId, uploadStatus)
        if (!products || products.length == 0) {
            throw new NotFoundException({
                trigger: 'Empty',
                message: 'The provider has no ready products to download',
            })
        }
        if (uploadStatus == 'no_seleccionada') {
            for (let product of products) {
                product.imagesUrl =
                    'https://saldu.co/wp-content/uploads/cargas/default/Saldu_Enconstruccion.jpg'
            }
        }
        const csvStream = this.csvManagerService.processEntityToCsv(products)
        csvStream.pipe(response)
    }
}
