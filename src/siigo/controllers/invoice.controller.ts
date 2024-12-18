import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
} from '@nestjs/common'
import { CreateInvoiceDTO, UpdateInvoiceDTO } from '../dtos/invoice.dto'
import { InvoiceService } from '../services/invoice.service'
import IOrders from 'src/orders/orders.interface'

@Controller('invoice')
export class InvoiceController {
    constructor(private invoiceService: InvoiceService) {}

    @Post()
    createEntity(@Body() payload: CreateInvoiceDTO) {
        //Calcular valores de los inlines f(isShipping)
        //Crear product inlines
        //Calcular total de la factura
        return this.invoiceService.createEntity(payload)
    }

    @Get()
    findAll(@Query('status') status?: string | undefined) {
        return this.invoiceService.findAll(status)
    }

    @Get()
    findAllSiigoRejected() {
        return this.invoiceService.findAllSiigoRejected()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceService.findOne(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateInvoiceDTO,
    ) {
        return this.invoiceService.updateEntity(id, payload)
    }

    @Post('siigo/:id')
    siigoInvoiceUpload(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: IOrders,
    ) {
        return this.invoiceService.siigoInvoiceUpload(id, payload)
    }
}
