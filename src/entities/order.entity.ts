import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column({ type: 'int', name: 'woo_commerce_id' })
    wooCommerceId: number

    @Column({ type: 'varchar', name: 'delivery_url', nullable: true })
    deliveryUrl: string

    @Column({ type: 'varchar', name: 'seller_invoice', nullable: true })
    sellerInvoiceUrl: string

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
