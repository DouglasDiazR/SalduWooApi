import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UploadedFile,
    UseGuards,
    UseInterceptors,
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
import { Status } from 'src/enum/status.enum'
import { UpdateInvoiceDTO } from 'src/siigo/dtos/invoice.dto'
import { FileInterceptor } from '@nestjs/platform-express'
import { S3Service } from './s3.service'

@ApiTags('Ordenes')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
        private s3Service: S3Service,
    ) {}

    @Get('admin')
    @ApiOperation({
        summary:
            'Ruta de Administrador para obtener todas las ordenes de todos los productos',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description:
            'Filtrar ordenes por estado (pending, processing, on-hold, completed, cancelled, refunded, failed or trash.)',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
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
        @Query('status') status?: Status,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? Number(page) : 1
        const limintNum = limit ? Number(limit) : 10
        const orders = await this.ordersService.getAllOrders({
            status,
            startDate,
            endDate,
            page: pageNum,
            limit: limintNum,
        })
        return orders
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
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
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

    @Get('admin/seller')
    @ApiOperation({
        summary:
            'Ruta de Administrador para obtener las ordenes de un vendedor',
    })
    @ApiQuery({
        name: 'vendorId',
        required: false,
        description: 'ID del vendedor',
        example: 5122,
    })
    @ApiQuery({
        name: 'name',
        required: false,
        description: 'Nombre del vendedor',
        example: 'Construcciones Colombia',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
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
    async getOrdersBySeller(
        @Query('vendorId') vendorId: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? Number(page) : 1
        const limitNum = limit ? Number(limit) : 10
        return await this.ordersService.getOrdersBySeller({
            vendorId,
            startDate,
            endDate,
            page: pageNum,
            limit: limitNum,
        })
    }
    @Get('seller/:id')
    @ApiOperation({
        summary:
            'Ruta de Vendedor para obtener todas las ordenes de los productos propios',
    })
    @ApiQuery({
        name: 'status',
        required: false,
        description:
            'Filtrar ordenes por estado (pending, processing, on-hold, completed, cancelled, refunded, failed or trash.)',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
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
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
    async getOrdersForSeller(
        // @Req() request: Express.Request,
        @Param('id') id: string,
        @Query('status') status?: Status,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const pageNum = page ? Number(page) : 1
        const limintNum = limit ? Number(limit) : 10
        return await this.ordersService.getAllOrdersForSeller({
            status,
            startDate,
            endDate,
            vendorId: Number(id),
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
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        description:
            'Fecha de inicio de la búsqueda de ordenes (formato: YYYY-MM-DD)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        description:
            'Fecha de fin de la búsqueda de ordenes (formato: YYYY-MM-DD)',
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
    })
    @HttpCode(200)
    // @UseGuards(AuthGuard)
    // @Roles(Role.Admin)
    async getOrderById(@Param('id') id: number) {
        return await this.ordersService.getOrderById(id)
    }

    @Get('evidence:id')
    async getEvidence(@Param('id') id: number) {
        return await this.ordersService.getOrderEvidence(id)
    }

    @Post('s3-evidence/:providerId/:orderId/:type')
    @UseInterceptors(FileInterceptor('file'))
    async evidenceFile(
        @UploadedFile() file: Express.Multer.File,
        @Param('orderId', ParseIntPipe) orderId: number,
        @Param('providerId', ParseIntPipe) providerId: number,
        @Param('type') type: string,
    ) {
        if (
            !file.mimetype.startsWith('image/') &&
            !file.mimetype.startsWith('application/pdf')
        ) {
            throw new BadRequestException(
                'El archivo debe ser una imagen o un PDF.',
            )
        }
        console.log('controller');
        
        const bucketName = process.env.AWS_S3_BUCKET_NAME
        const url = await this.s3Service.uploadEvidenceFile(
            providerId,
            orderId,
            type,
            file,
            bucketName,
        )
        switch (type) {
            case 'delivery':
                await this.ordersService.updateOrderEvidence(orderId, { deliveryUrl: url })
                break
            case 'invoicing':
                await this.ordersService.updateOrderEvidence(orderId, { sellerInvoiceUrl: url })
                break
        }
        return { url }
    }

    @Put(':id')
    async updateOrder(@Param('id') id: number, @Body() payload: string) {
        return await this.ordersService.updateOrder(id, payload)
    }
}
