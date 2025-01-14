import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { SalduProduct } from './saldu-products.entity'
import { TaxDiscount } from './tax-discount.entity'
import { UploadProduct } from './upload-product.entity'

@Entity('load')
export class Load {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        name: 'provider_id',
        nullable: true,
        default: 0
    })
    providerId: number

    @Column({ type: 'varchar', length: 128, nullable: false })
    reference: string

    @OneToMany(() => UploadProduct, (product) => product.load)
    uploadProducts: UploadProduct[]

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
