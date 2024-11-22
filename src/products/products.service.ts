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
    try {
      const products = await this.productsRepository.getAllProducts();
      const productsData = await Promise.all(
        products.map(async (product) => {
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            status: product.status,
            price: product.price,
            images: product.images,
            stock_status: product.stock_status
          }
        }) 
      )  
      return productsData
      } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductsByUser(id: number) {
    try {
      const products = await this.productsRepository.getProductsByUser(id)
      const productsData = await Promise.all(
        products.map(async (product) => {
          return {
            id: product.id,
            name: product.name,
            description: product.description,
            status: product.status,
            price: product.price,
            images: product.images,
            stock_status: product.stock_status
          }
        })
      )
      return productsData
    } catch (error) {
      throw new Error(`Error al obtener los productos del usuario con id: ${id}`)
    }
  }

  async getProductById(id: number) {
    try {
      const response = await this.WooComerce.get(`products/${id}`)
        return {
          id: response.data.id,
          name: response.data.name,
          description: response.data.description,
          status: response.data.status,
          price: response.data.price,
          images: response.data.images,
          stock_quantity: response.data.stock_quantity
        }
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
