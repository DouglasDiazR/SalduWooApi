import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common'
import { CreateInvoiceErrorLogDTO, UpdateInvoiceErrorLogDTO } from '../dtos/invoice-error-log.dto'
import { InvoiceErrorLogService } from '../services/invoice-error-log.service'

@Controller('invoice-error-log')
export class InvoiceErrorLogController {
    constructor(private invoiceErrorLogService: InvoiceErrorLogService) {}

    @Post()
    createEntity(@Body() payload: CreateInvoiceErrorLogDTO) {
        return this.invoiceErrorLogService.createEntity(payload)
    }

    @Get()
    findAll() {
        return this.invoiceErrorLogService.findAll()
    }

    @Get('invoice/:id')
    findByInvoiceId(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceErrorLogService.findByInvoiceId(id)
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceErrorLogService.findOne(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateInvoiceErrorLogDTO,
    ) {
        return this.invoiceErrorLogService.updateEntity(id, payload)
    }

    @Delete(':id')
    deleteEntity(@Param('id', ParseIntPipe) id: number) {
        return this.invoiceErrorLogService.deleteEntity(id)
    }
}
