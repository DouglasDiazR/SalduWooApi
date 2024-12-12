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
import { TaxDiscount } from './tax-discount.entity'

@Entity('charge')
export class Charge {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'boolean', name: 'is_active' })
    isActive: boolean

    @ManyToOne(() => TaxDiscount, (taxDiscount) => taxDiscount.charges)
    taxDiscount: TaxDiscount

    @ManyToOne(() => SalduProduct, (salduProduct) => salduProduct.charges)
    product: SalduProduct

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date | null

    @UpdateDateColumn({
        type: 'timestamp',
        name: 'updated_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date | null

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
        nullable: true,
    })
    deletedAt: Date | null
}
