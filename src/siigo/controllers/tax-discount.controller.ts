import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { TaxDiscountService } from '../services/tax-discount.service';
import { CreateTaxDiscountDTO, UpdateTaxDiscountDTO } from '../dtos/tax-discount.dto';

@Controller('tax-discount')
export class TaxDiscountController {
    constructor(
        private taxDiscountService: TaxDiscountService
    ) {}

    @Post()
    createEntity(@Body() payload: CreateTaxDiscountDTO) {
      return this.taxDiscountService.createEntity(payload);
    }
  
    @Get()
    findAll() {
      return this.taxDiscountService.findAll();
    }
  
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.taxDiscountService.findOne(id);
    }
  
    @Put(':id')
    updateEntity(
      @Param('id', ParseIntPipe) id: number,
      @Body() payload: UpdateTaxDiscountDTO
    ) {
      return this.taxDiscountService.updateEntity(id, payload);
    }

    @Delete(':id')
    deleteEntity(@Param('id', ParseIntPipe) id: number) {
      return this.taxDiscountService.deleteEntity(id);
    }
}
