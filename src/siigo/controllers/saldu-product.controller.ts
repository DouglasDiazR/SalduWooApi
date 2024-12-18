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
import {
    CreateSalduProductDTO,
    UpdateSalduProductDTO,
} from '../dtos/saldu-product.dto'
import { SalduProductService } from '../services/saldu-product.service'
import { ChargeService } from '../services/charge.service'
import { SalduProduct } from 'src/entities/saldu-products.entity'

@Controller('saldu-product')
export class SalduProductController {
    constructor(
        private salduProductService: SalduProductService,
        private chargeService: ChargeService,
    ) {}

    @Post()
    async createEntity(@Body() payload: CreateSalduProductDTO) {
        const newProduct: SalduProduct = await this.salduProductService.createEntity(payload)
        this.chargeService.createEntity({
            isActive: true,
            salduProductId: newProduct.id,
            taxDiscountId: payload.taxDiscountId
        })
        return newProduct
    }

    @Get()
    findAll() {
        return this.salduProductService.findAll()
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.salduProductService.findOne(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateSalduProductDTO,
    ) {
        return this.salduProductService.updateEntity(id, payload)
    }

    @Delete(':id')
    deleteEntity(@Param('id', ParseIntPipe) id: number) {
        return this.salduProductService.deleteEntity(id)
    }
}
