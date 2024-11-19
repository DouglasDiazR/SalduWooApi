import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
// import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async getAllProducts() {
    return await this.productsService.getAllProducts()
  }

  @Get('user')
  async getProductsByUser(@Body('id') id: string) {
    return await this.productsService.getProductsByUser(Number(id))
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productsService.getProductById(Number(id));
  }

  // @Patch(':id')
  // async updateProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return await this.productsService.updateProduct(Number(id), updateProductDto);
  // }
}
