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

@Entity('tax_discount')
export class TaxDiscount {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'bigint', name: 'siigo_id', nullable: true })
    siigoId: number

    @Column({ type: 'varchar', length: 24 })
    category: string

    @Column({ type: 'varchar', length: 24 })
    name: string

    @Column({ type: 'float', nullable: true })
    value: number

    @OneToMany(() => Charge, (charge) => charge.taxDiscount)
    charges: Charge[]

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
