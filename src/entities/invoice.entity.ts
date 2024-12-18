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
import { PaymentOption } from './payment-option.entity'
import { InvoiceErrorLog } from './invoice-error-log.entity'
import { SalduProduct } from './saldu-products.entity'
import { SalduInlineProduct } from './saldu-inline-product.entity'

@Entity('invoices')
export class Invoice {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'int', name: 'order_id' })
    orderId: number

    @Column({ type: 'float', name: 'order_total' })
    orderTotal: number

    @Column({ type: 'float', name: 'taxed_price', default: 0 })
    taxedPrice: number

    @Column({ type: 'varchar', name: 'siigo_id', length: 256, nullable: true })
    siigoId: string

    @Column({
        type: 'varchar',
        name: 'siigo_status',
        length: 256,
        nullable: true,
        default: 'On Hold',
    })
    siigoStatus: string

    @Column({
        type: 'varchar',
        name: 'siigo_name',
        length: 256,
        nullable: true,
    })
    siigoName: string

    @Column({ type: 'varchar', length: 256, nullable: true })
    cufe: string

    @Column({
        type: 'varchar',
        name: 'siigo_date',
        length: 256,
        nullable: true,
    })
    siigoDate: string

    @Column({ type: 'boolean', name: 'customer_mailed', default: false })
    customerMailed: boolean

    @Column({
        type: 'varchar',
        name: 'public_url',
        length: 256,
        nullable: true,
    })
    publicUrl: string

    @OneToMany(() => InvoiceErrorLog, (errorLog) => errorLog.invoice)
    errorLogs: InvoiceErrorLog

    @ManyToOne(() => PaymentOption, (paymentOption) => paymentOption.invoices)
    paymentOption: PaymentOption

    @OneToMany(
        () => SalduInlineProduct,
        (salduInlineProduct) => salduInlineProduct.invoice,
    )
    salduInlineProducts: SalduInlineProduct[]

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
