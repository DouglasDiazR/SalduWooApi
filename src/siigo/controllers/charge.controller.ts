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
import { CreateChargeDTO, UpdateChargeDTO } from '../dtos/charge.dto'
import { ChargeService } from '../services/charge.service'

@Controller('charge')
export class ChargeController {
    constructor(private chargeService: ChargeService) {}

    @Post()
    createEntity(@Body() payload: CreateChargeDTO) {
        return this.chargeService.createEntity(payload)
    }

    @Get(':id')
    findAllByProductId(@Param('id', ParseIntPipe) id: number) {
        return this.chargeService.findAllByProductId(id)
    }

    @Put(':id')
    updateEntity(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: UpdateChargeDTO,
    ) {
        return this.chargeService.updateEntity(id, payload)
    }

    @Delete(':id')
    deleteEntity(@Param('id', ParseIntPipe) id: number) {
        return this.chargeService.deleteEntity(id)
    }
}
