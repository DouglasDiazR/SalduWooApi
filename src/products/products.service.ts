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
import { UsersRepository } from 'src/users/users.repository'

@Injectable()
export class ProductsService {
    constructor(
        private readonly productsRepository: ProductsRepository,
        private readonly usersRepository: UsersRepository,
        private readonly WooCommerce: WooCommerceRestApi,
    ) {}

    async getAllProducts(page, limit) {
        try {
            const [products, totalElements] =
                await this.productsRepository.getAllProducts(page, limit)
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
            const totalPages = Math.ceil(totalElements / Number(limit))
            const hasPrevPage = Number(page) > 1
            const hasNextPage = Number(page) < totalPages
            const prevPage = hasPrevPage ? Number(page) - 1 : null
            const nextPage = hasNextPage ? Number(page) + 1 : null

            return {
                productsData,
                totalElements,
                page,
                limit,
                totalPages,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            }
        } catch (error) {
            throw new Error('Error al obtener los productos')
        }
    }

    async getProductsByUser(vendorId: number, page: number, limit: number) {
        try {
            const [products, totalElements] =
                await this.productsRepository.getProductsByUser(
                    vendorId,
                    page,
                    limit,
                )

            if (totalElements === 0) {
                throw new NotFoundException(
                    'No se encontraron productos asociados a este vendedor.',
                )
            }
            console.log(products[1])
            console.log(products[2])
            console.log(products[3])
            console.log(products[4])
            const productsData = await Promise.all(
                products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    description: product.description,
                    status: product.status,
                    price: product.price,
                    images: product.images,
                    stock_status: product.stock_status,
                })),
            )
            const totalPages = Math.ceil(totalElements / Number(limit))
            const hasPrevPage = Number(page) > 1
            const hasNextPage = Number(page) < totalPages
            const prevPage = hasPrevPage ? Number(page) - 1 : null
            const nextPage = hasNextPage ? Number(page) + 1 : null
            //console.log(productsData[1]);
            return {
                productsData,
                totalElements,
                page,
                limit,
                totalPages,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
            }
        } catch (error) {
            if (error instanceof NotFoundException) throw error
            throw new InternalServerErrorException(
                'Hubo un error al obtener los productos del vendedor.',
            )
        }
    }

    async getProductById(productId: number, userId: number) {
        try {
            console.log('service')

            const response = await this.WooCommerce.get(`products/${productId}`)
            const product = response.data
            const user = await this.usersRepository.getUserById(userId)
            console.log(product)
            // if (user.role === Role.Seller) {
            //     const vendorMetaData = product.meta_data.find( (meta) => meta.key === 'vendedor' )
            //     if (vendorMetaData?.value !== String(user.id_wooCommerce)) {
            //         throw new ForbiddenException('No tienes permiso para acceder a este producto.')
            //     }
            // }

            const productDetails = {
                id: product.id,
                name: product.name,
                description: product.description,
                quantity: product.stock_quantity,
                price: product.price,
                status: product.status,
                images: [{
                    id: product.images[0].id,
                    name: product.images[0].name,
                    src: product.images[0].src,
                }],
                meta_data: product.meta_data,
            }

            return productDetails
        } catch (error) {
            if (error.response?.status === 404) {
                throw new NotFoundException(
                    `No se encontró el producto con ID: ${productId}.`,
                )
            }
            throw new InternalServerErrorException(
                `Hubo un error al obtener el producto. ${error}`,
            )
        }
    }

    async getProductForSeller(productId: number, vendorId: number) {
        try {
            const response = await this.WooCommerce.get(`products/${productId}`)
            const product = response.data

            const vendorMetaData = product.meta_data.find(
                (meta) => meta.key === 'vendedor',
            )

            if (vendorMetaData?.value !== String(vendorId)) {
                throw new ForbiddenException(
                    'No tienes permiso para acceder a este producto.',
                )
            }

            const productDetails = {
                product_id: product.id,
                name: product.name,
                stock_quantity: product.stock_quantity || 0,
                stock_status: product.stock_status,
                price: product.price,
                total: product.total_sales || 0,
                meta_data: product.meta_data || [],
            }
            console.log(productDetails)
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

    async createProduct(product: any) {
        return await this.productsRepository.createProduct(product)
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto) {
        return await this.productsRepository.updateProduct(id, updateProductDto)
    }

    async activateProduct(id: number) {
        try {
            const payload = { status: 'publish' }
            const response = await this.WooCommerce.put(`products/${id}`, payload);
            console.log('WooCommerce Update try: ', response)
        } catch (error) {
            console.log('WooCommerce Update fail: ', error)
        }
        return await this.productsRepository.activateProduct(id)
    }

    async deleteProduct(id: number) {
        try {
            const payload = { status: 'draft' }
            const response = await this.WooCommerce.put(`products/${id}`, payload);
            console.log('WooCommerce Update try: ', response)
        } catch (error) {
            console.log('WooCommerce Update fail: ', error)
        }
        return await this.productsRepository.deleteProduct(id)
    }
}
