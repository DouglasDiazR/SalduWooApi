import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Charge } from './charge.entity'
import { Invoice } from './invoice.entity'
import { SalduInlineProduct } from './saldu-inline-product.entity'

@Entity('saldu_products')
export class SalduProduct {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        name: 'internal_code',
        length: 8,
        nullable: true,
    })
    internalCode: string

    @Column({ type: 'varchar', name: 'siigo_id', length: 256, nullable: true })
    siigoId: string

    @Column({ type: 'varchar', length: 256 })
    name: string

    @Column({ type: 'varchar', nullable: true, length: 528 })
    description: string

    @OneToMany(() => Charge, (charge) => charge.salduProduct)
    charges: Charge[]

    @OneToMany(() => SalduInlineProduct, (salduInlineProduct) => salduInlineProduct.salduProduct)
    salduInlineProducts: SalduInlineProduct[];

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date | null
}
