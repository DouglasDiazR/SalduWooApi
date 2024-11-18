import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api'
import IWooCommerceCustomer from './wooApi.interface'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { Products } from 'src/entities/products.entity'
import { Users } from 'src/entities/users.entity'

@Injectable()
export class WooCommerceService {
    constructor(
        @InjectRepository(Users) private readonly usersRepository: Repository<Users>,
        @InjectRepository(Products) private readonly productsRepository: Repository<Products>,
        private readonly WooCommerce: WooCommerceRestApi,
    ) {}

    async getApiEndpoints() {
        try {
            const response = await this.WooCommerce.get('')
            return response.data
        } catch (error) {
            throw new Error('Error al obtener los puntos finales')
        }
    }

    async getUsers() {
        const roles = ['vendedor', 'administrator']
        const perPage = 100
        let users: IWooCommerceCustomer[] = []

        try {
            for (const role of roles) {
                let page = 1
                while (true) {
                    const response = await this.WooCommerce.get('customers', {
                        page,
                        per_page: perPage,
                        role,
                    })

                    if (response.data.length === 0) break

                    users = users.concat(response.data)
                    page += 1
                }
            }

            const newUsers = await Promise.all(
                users.map(async (user: IWooCommerceCustomer) => {
                    const existinguser = await this.usersRepository
                        .createQueryBuilder('user')
                        .where('user.email = :email', {
                            email: user.email,
                        })
                        .orWhere('user.id_wooCommerce = :id_wooCommerce', {
                            id_wooCommerce: user.id,
                        })
                        .getOne()

                    if (existinguser) return null

                    const randomPassword = Math.random().toString(36).slice(-8)
                    console.log(
                        'user:',
                        user.email,
                        'passRAndom:',
                        randomPassword,
                    )
                    const hashedPassword = await bcrypt.hash(randomPassword, 10)

                    return {
                        id_wooCommerce: user.id,
                        email: user.email.toLocaleLowerCase(),
                        name: user.first_name.toLocaleLowerCase(),
                        role: user.role,
                        password: hashedPassword,
                    }
                }),
            )

            const saveUsers = newUsers.filter(
                (user): user is Users => user !== null,
            )

            if (saveUsers.length > 0) {
                await this.usersRepository.save(saveUsers)
            }

            return saveUsers
        } catch (error) {
            console.log(error)
            throw new InternalServerErrorException(
                'Error al registrar los Clientes',
            )
        }
    }

    async getProducts() {
        const per_page = 50;
        for (let page = 1; ; page++) {
            try {
                const response = await this.WooCommerce.get('products', {
                    per_page,
                    page,
                })
                if (response.data.length === 0) break
                for (const product of response.data) {
                    const id_wooCommerce = await product.meta_data.find((meta) => meta.key === 'vendedor')?.value
                    if (!id_wooCommerce) console.log(`vendedor no encontrado para el producto: ${product.id}`);
                    const user = id_wooCommerce
                        ? await this.usersRepository.findOne({where: { id_wooCommerce: Number(id_wooCommerce) }})
                        : null;
                    const newProduct = this.productsRepository.create({
                        id: product.id,
                        name: product.name,
                        type: product.type,
                        status: product.status,
                        featured: product.featured,
                        catalog_visibility: product.catalog_visibility,
                        description: product.description,
                        price: product.price ? parseFloat(product.price) : 0,
                        regular_price: product.regular_price ? parseFloat(product.regular_price) : 0,
                        user: user
                    });
    
                    await this.productsRepository.save(newProduct);
                }
            } catch (error) {
                console.log('Error especifico:', error);
                throw new Error('Error al obtener los productos');
            }
        }
        return { message: 'Productos obtenidos' };
    }
}
