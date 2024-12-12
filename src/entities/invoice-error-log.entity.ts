import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Invoice } from './invoice.entity'

@Entity('invoice_error_log')
export class InvoiceErrorLog {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 256 })
    code: string

    @Column({ type: 'text' })
    message: string

    @Column({ type: 'varchar', length: 256 })
    param: string

    @ManyToOne(() => Invoice, (invoice) => invoice.errorLogs)
    invoice: Invoice

    @CreateDateColumn({
        type: 'timestamp',
        name: 'created_at',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date
}
