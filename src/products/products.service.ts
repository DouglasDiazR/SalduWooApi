import { Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsRepository } from './products.repository';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly WooComerce: WooCommerceRestApi
  ) {}

  async getAllProducts() {
    return await this.productsRepository.getAllProducts();
  }

  async getProductsByUser(id: number) {
    try {
      return await this.productsRepository.getProductsByUser(id)
    } catch (error) {
      throw new Error(`Error al obtener los productos del usuario con id: ${id}`)
    }
  }

  async getProductById(id: number) {
    try {
      const response = await this.WooComerce.get(`products/${id}`)
      return response.data
    } catch (error) {
      throw new Error(`Error al obtener el producto con id: ${id}`)
    }
  }

  async createProduct(product: any) {
    return await this.productsRepository.createProduct(product)
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto) {
    return await this.productsRepository.updateProduct(id, updateProductDto)
  }

  async deleteProduct(id: number) {
    return await this.productsRepository.deleteProduct(id)
  }
}
