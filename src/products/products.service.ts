import {
    ForbiddenException,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
} from '@nestjs/common'
import { UpdateProductDto } from './dto/update-product.dto'
import { ProductsRepository } from './products.repository'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import { Role } from 'src/enum/role.enum'

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly WooComerce: WooCommerceRestApi,
    ) {}

    async getAllProducts() {
        try {
            const products = await this.productsRepository.getAllProducts()
            const productsData = await Promise.all(
                products.map(async (product) => {
                    return {
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        status: product.status,
                        price: product.price,
                        images: product.images,
                        stock_status: product.stock_status,
                    }
                }),
            )
            return productsData
        } catch (error) {
            throw new Error('Error al obtener los productos')
        }
    }

    async getProductsByUser({
        vendorId,
        page = 1,
        limit = 10,
    }: {
        vendorId: number
        page?: number
        limit?: number
    }) {
        try {
            const products = await this.productsRepository.getProductsByUser({
                vendorId,
                page,
                limit,
            })

            if (products.length === 0) {
                throw new NotFoundException(
                    'No se encontraron productos asociados a este vendedor.',
                )
            }

            const formattedProducts = products.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description,
                status: product.status,
                price: product.price,
                images: product.images,
                stock_status: product.stock_status,
            }))

            return formattedProducts
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener los productos del vendedor.',
            )
        }
    }

    async getProductById({
        productId,
        role,
        vendorId,
    }: {
        productId: number
        role: Role
        vendorId?: number
    }) {
        try {
            // Obtenemos el producto desde WooCommerce
            const response = await this.WooComerce.get(`products/${productId}`)
            const product = response.data

            // Construir un objeto con la estructura solicitada
            const productDetails = {
                product_id: product.id, // Asumiendo que el id es el product_id
                name: product.name,
                quantity: product.stock_quantity || 0, // Si no hay stock_quantity, asignamos 0 por defecto
                price: product.price,
                total: product.total_sales || 0, // Si no hay total_sales, asignamos 0 por defecto
                meta_data: product.meta_data || [], // meta_data puede ser vacío si no existe
            }

            // Si el rol es Seller, verificamos si el producto pertenece al vendedor
            if (role === Role.Seller && product.vendor_id !== vendorId) {
                throw new ForbiddenException(
                    'No tienes permiso para acceder a este producto.',
                )
            }

            return productDetails
        } catch (error) {
            if (error.response?.status === 404) {
                throw new NotFoundException(
                    `No se encontró el producto con ID: ${productId}.`,
                )
            }
            throw new InternalServerErrorException(
                'Hubo un error al obtener el producto.',
            )
        }
    }

    async getProductForSeller({
        productId,
        vendorId,
    }: {
        productId: string
        vendorId: number
    }) {
        try {
            // Obtenemos el producto desde WooCommerce
            const response = await this.WooComerce.get(`products/${productId}`)
            const product = response.data
            console.log('Producto:', product)

            // Verificamos si el producto pertenece al vendedor
            const vendorMetaData = product.meta_data.find(
                (meta) => meta.key === 'vendedor',
            )

            if (vendorMetaData?.value !== String(vendorId)) {
                throw new ForbiddenException(
                    'No tienes permiso para acceder a este producto.',
                )
            }

            // Construimos el objeto con los detalles del producto
            const productDetails = {
                product_id: product.id, // Asumiendo que el id es el product_id
                name: product.name,
                quantity: product.stock_quantity || 0, // Si no hay stock_quantity, asignamos 0 por defecto
                price: product.price,
                total: product.total_sales || 0, // Si no hay total_sales, asignamos 0 por defecto
                meta_data: product.meta_data || [], // meta_data puede ser vacío si no existe
            }

            return productDetails
        } catch (error) {
            console.log(error)
            if (error.response?.status === 404) {
                throw new NotFoundException(
                    `No se encontró el producto con ID: ${productId}.`,
                )
            }
            throw new InternalServerErrorException(
                'Hubo un error al obtener el producto.',
            )
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
