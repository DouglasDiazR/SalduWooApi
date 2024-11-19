import { Injectable } from '@nestjs/common';
// import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository
  ) {}

  async getAllProducts() {
    return await this.productsRepository.getAllProducts();
  }

  async getProductsByUser(id: number) {
    return await this.productsRepository.getProductsByUser(id)
  }
  async getProductById(id: number) {
    return await this.productsRepository.getProductById(id)
  }

  // async updateProduct(id: number, updateProductDto: UpdateProductDto) {
  //   return await this.productsRepository.updateProduct(id, updateProductDto)
  // }
}
