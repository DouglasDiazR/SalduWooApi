import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Users } from './users.entity'

@Entity({
    name: 'products',
})
export class Products {
    @PrimaryColumn({
        type: 'int',
        unique: true,
        nullable: false,
    })
    id: number

    @Column({
        type: 'varchar',
        nullable: false,
    })
    name: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    type: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    status: string

    @Column({
        type: 'boolean',
        default: false,
    })
    featured: boolean

    @Column({
        type: 'varchar',
        nullable: false,
    })
    catalog_visibility: string

    @Column({
        type: 'text',
        nullable: false,
    })
    description: string

    @Column({
        type: 'float',
        nullable: false,
    })
    price: number

    @Column({
        type: 'float',
        nullable: false,
    })
    regular_price: number

    @ManyToOne(() => Users, (user) => user.products, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    user?: Users | null
}
