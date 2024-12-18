import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
} from '@nestjs/common'
import { PaymentOptionService } from '../services/payment-option.service'
import {
    CreatePaymentOptionDTO,
    UpdatePaymentOptionDTO,
} from '../dtos/payment-option.dto'

@Controller('payment-option')
export class PaymentOptionController {
    constructor(private paymentOptionService: PaymentOptionService) {}

    @Post()
    createEntity(@Body() payload: CreatePaymentOptionDTO) {
        return this.paymentOptionService.createEntity(payload)
    }

    @Get()
    findAll() {
        return this.paymentOptionService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.paymentOptionService.findOne(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdatePaymentOptionDTO,
    ) {
        return this.paymentOptionService.updateEntity(id, payload)
    }

    @Delete(':id')
    deleteEntity(@Param('id', ParseIntPipe) id: number) {
        return this.paymentOptionService.deleteEntity(id)
    }
}
