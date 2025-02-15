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
    @ApiOperation({ summary: 'Ruta de Administrador para obtener todos los productos' })
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
    // @UseGuards(AuthGuard)
    // @Roles(Role.Admin)
    async getAllProducts(
        @Req() request: Express.Request,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {
        if (!page) page = '1'
        if (!limit) limit = '12'
        return await this.productsService.getAllProducts(Number(page), Number(limit))
    }

    // @Get('user')
    // @ApiOperation({ summary: 'Ruta de Vendedor para obtener sus productos propios' })
    // @ApiQuery({
    //     name: 'page',
    //     required: false,
    //     description: 'Número de página',
    //     example: 1,
    // })
    // @ApiQuery({
    //     name: 'limit',
    //     required: false,
    //     description: 'Cantidad de productos por página (máximo 10)',
    //     example: 10,
    // })
    // @HttpCode(200)
    // // @UseGuards(AuthGuard)
    // // @Roles(Role.Seller)
    // async getProductsByUser(
    //     @Req() request: Express.Request,
    //     @Query('page') page?: string,
    //     @Query('limit') limit?: string,
    // ) {
    //     const user = request.user
    //     const { id_wooCommerce: vendorId } = user
    //     if (!page) page = '1' 
    //     if (!limit) limit = '12'
    //     return await this.productsService.getProductsByUser( vendorId, Number(page), Number(limit) )
    // }

    @Get('user/:id')
    @ApiOperation({ summary: 'Ruta de Vendedor para obtener sus productos propios' })
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
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
    async getProductsByUser(
        @Param('id') providerId: number,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
    ) {

        if (!page) page = '1' 
        if (!limit) limit = '2000'
        return await this.productsService.getProductsByUser( providerId, Number(page), Number(limit) )
    }

    @Get(':providerId/:id')
    @ApiOperation({ summary: 'Ruta de Vendedor para obtener un producto propio por ID' })
    @ApiParam({
        name: 'providerId',
        required: true,
        description: 'ID del proveedor',
        example: 2,
    })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'ID del producto',
        example: 5122,
    })
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller, Role.Admin)
    async getProductById(
        //@Req() request: Express.Request,
        @Param('id') id: string,
        @Param('providerId') providerId: string
    ) {
        const productId = Number(id)
        const userId = Number(providerId)
        return await this.productsService.getProductById( productId, userId )
    }

    @Post('create')
    @ApiOperation({ summary: 'Ruta de vendedor para crear un producto' })
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
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
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
    ) {
        console.log('Controller: ', updateProductDto);
        
        return await this.productsService.updateProduct(
            Number(id),
            updateProductDto,
        )
    }

    @Patch('activate/:id')
    @ApiOperation({ summary: 'Ruta de vendedor para cambiar el estatus de un producto a activo' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id del producto',
        example: '5122',
    })
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
    async activateProduct(@Param('id') id: string) {
        return await this.productsService.activateProduct(Number(id))
    }

    @Patch('delete/:id')
    @ApiOperation({ summary: 'Ruta de vendedor para cambiar el estatus de un producto a inactivo' })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id del producto',
        example: '5122',
    })
    // @UseGuards(AuthGuard)
    // @Roles(Role.Seller)
    async deleteProduct(@Param('id') id: string) {
        return await this.productsService.deleteProduct(Number(id))
    }
}
