import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
import { Products } from './products.entity'
@Entity({
    name: 'users',
})
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id_user: string

    @Column({
        type: 'int',
        unique: true,
        nullable: false,
    })
    id_wooCommerce: number

    @Column({
        type: 'varchar',
        length: 128,
    })
    name: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    email: string

    @Column({
        type: 'varchar',
        length: 128,
        nullable: false,
    })
    role: string

    @Column({ type: 'varchar', length: 128, nullable: false })
    password: string

    @OneToMany(() => Products, (product) => product.user)
    products: Products[]
}
