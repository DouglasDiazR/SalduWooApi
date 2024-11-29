import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    HttpCode,
    Req,
    Query,
    ForbiddenException,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { UpdateProductDto } from './dto/update-product.dto'
import { CreateProductDto } from './dto/create-product.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import {
    ApiBearerAuth,
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiTags,
} from '@nestjs/swagger'

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({
        summary: 'Ruta de Administrador para obtener todos los productos',
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getAllProducts() {
        return await this.productsService.getAllProducts()
    }

    @Get('user')
    @ApiOperation({
        summary: 'Ruta de Vendedor para obtener sus productos propios',
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
        description: 'Cantidad de productos por página (máximo 10)',
        example: 10,
    })
    @HttpCode(200)
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getProductsByUser(
        @Req() request: Express.Request,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user
        const pageNum = page ? Number(page) : 1
        const limitNum = limit ? Number(limit) : 10

        return await this.productsService.getProductsByUser({
            vendorId,
            page: pageNum,
            limit: limitNum,
        })
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Ruta de Vendedor para obtener un producto propio por ID',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID del producto',
        example: 5122,
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getProductByIdForSeller(
        @Req() request: Express.Request,
        @Param('id') id: string,
    ) {
        const user = request.user
        const { id_wooCommerce: vendorId } = user

        // Llamamos al servicio para obtener el producto
        return await this.productsService.getProductForSeller({
            productId: id,
            vendorId,
        })
    }

    @Post('create')
    @ApiOperation({ summary: 'Ruta de vendedor para crear un producto' })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.createProduct(createProductDto)
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Ruta de vendedor para actualizar un producto' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id del producto',
        example: '5122',
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        return await this.productsService.updateProduct(
            Number(id),
            updateProductDto,
        )
    }

    @Patch('delete/:id')
    @ApiOperation({
        summary:
            'Ruta de vendedor para cambiar el estatus de un producto a inactivo',
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id del producto',
        example: '5122',
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async deleteProduct(@Param('id') id: string) {
        return await this.productsService.deleteProduct(Number(id))
    }
}
