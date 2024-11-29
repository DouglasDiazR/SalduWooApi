import {
    Controller,
    Get,
    HttpCode,
    Param,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common'
import { OrdersService } from './orders.service'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import {
    ApiBearerAuth,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'

@ApiTags('Ordenes')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get('admin')
    @ApiOperation({
        summary:
            'Ruta de Administrador para obtener todas las ordenes de todos los productos',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-31',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de órdenes por página (máximo 10)',
        example: 10,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrdersForAdmin(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? Number(page) : 1
        const limintNum = limit ? Number(limit) : 10
        return await this.ordersService.getAllOrders({
            startDate,
            endDate,
            page: pageNum,
            limit: limintNum,
        })
    }

    @Get('admin/product')
    @ApiOperation({
        summary:
            'Ruta de Administrador para obtener todas las ordenes de un producto',
    })
    @ApiQuery({
        name: 'productId',
        required: true,
        description: 'ID del producto',
        example: 5122,
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-31',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de órdenes por página (máximo 10)',
        example: 10,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrdersByProduct(
        @Query('productId') productId: number,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? Number(page) : 1
        const limitNum = limit ? Number(limit) : 10
        return await this.ordersService.getOrdersByProduct({
            productId,
            startDate,
            endDate,
            page: pageNum,
            limit: limitNum,
        })
    }

    @Get('seller')
    @ApiOperation({
        summary:
            'Ruta de Vendedor para obtener todas las ordenes de los productos propios',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-31',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de órdenes por página (máximo 10)',
        example: 10,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getOrdersForSeller(
        @Req() request: Express.Request,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user
        const pageNum = page ? Number(page) : 1
        const limintNum = limit ? Number(limit) : 10
        return await this.ordersService.getAllOrdersForSeller({
            startDate,
            endDate,
            vendorId,
            page: pageNum,
            limit: limintNum,
        })
    }

    @Get('seller/product')
    @ApiOperation({
        summary:
            'Ruta de Vendedor para obtener todas las ordenes de un producto propio',
    })
    @ApiQuery({
        name: 'productId',
        required: true,
        description: 'ID del producto',
        example: 5122,
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-01',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
        example: '2023-01-31',
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Número de página',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Cantidad de órdenes por página (máximo 10)',
        example: 10,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getOrdersForProduct(
        @Req() request: Express.Request,
        @Query('productId') productId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user
        const pageNum = page ? Number(page) : 1
        const limitNum = limit ? Number(limit) : 10
        return await this.ordersService.getOrdersSellerByProduct({
            productId,
            startDate,
            endDate,
            vendorId,
            page: pageNum,
            limit: limitNum,
        })
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Ruta de Administrador para obtener una orden por su ID',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID de la orden',
        example: 5122,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getOrderById(@Param('id') id: number) {
        return await this.ordersService.getOrderById(id)
    }
}
