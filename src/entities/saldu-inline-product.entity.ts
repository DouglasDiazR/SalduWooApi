import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { SalduProduct } from './saldu-products.entity'
import { Invoice } from './invoice.entity'

@Entity('saldu_inline_products')
export class SalduInlineProduct {
    @PrimaryGeneratedColumn({ type: 'integer', name: 'id' })
    id: number

    @Column({ type: 'float', name: 'taxed_price' })
    taxedPrice: number

    @ManyToOne(
        () => SalduProduct,
        (salduProduct) => salduProduct.salduInlineProducts,
    )
    salduProduct: SalduProduct

    @ManyToOne(() => Invoice, (invoice) => invoice.salduInlineProducts)
    invoice: Invoice

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
