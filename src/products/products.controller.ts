import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common'
import { ProductsService } from './products.service'
import { UpdateProductDto } from './dto/update-product.dto'
import { CreateProductDto } from './dto/create-product.dto'
import { AuthGuard } from 'src/guards/auth.guard'
import { Roles } from 'src/decorators/roles.decorator'
import { Role } from 'src/enum/role.enum'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'

@ApiTags('Productos')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    @ApiOperation({
        summary: 'Ruta de Administrador para obtener todos los productos',
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Admin)
    async getAllProducts() {
        return await this.productsService.getAllProducts()
    }

    @Get('user')
    @ApiOperation({ summary: 'Ruta de vendedor para obtener sus productos' })
    @ApiBody({
        required: true,
        schema: {
            type: 'number',
            description: 'id del usuario',
            example: { id: 1 },
        },
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getProductsByUser(@Body('id') id: string) {
        return await this.productsService.getProductsByUser(Number(id))
    }

    @Get(':id')
    @ApiOperation({ summary: 'Ruta de vendedor para obtener un producto por id'})
    @ApiParam({ 
      name: 'id', 
      required: true, 
      description: 'id del producto', 
      example: '5122' 
    })
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async getProductById(@Param('id') id: string) {
        return await this.productsService.getProductById(Number(id))
    }

    @Post('create')
    @ApiOperation({ summary: 'Ruta de vendedor para crear un producto'})
    @UseGuards(AuthGuard)
    @Roles(Role.Seller)
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productsService.createProduct(createProductDto)
    }

    @Patch('update/:id')
    @ApiOperation({ summary: 'Ruta de vendedor para actualizar un producto'})
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
    @ApiOperation({ summary: 'Ruta de vendedor para cambiar el estatus de un producto a inactivo'})
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
