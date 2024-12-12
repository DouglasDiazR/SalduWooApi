import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
  } from 'typeorm';
import { Invoice } from './invoice.entity';
  
  @Entity('payment_option')
  export class PaymentOption {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'int', name: 'siigo_id', nullable: true })
    siigoId: number;
  
    @Column({ type: 'varchar', length: 256 })
    name: string;
  
    @Column({ type: 'varchar', length: 256 })
    type: string;
  
    @Column({ type: 'boolean', name: 'is_active' })
    isActive: boolean;
  
    @OneToMany(() => Invoice, (invoice) => invoice.paymentOption)
    orders: Invoice[];
  
    @CreateDateColumn({
      type: 'timestamp',
      name: 'created_at',
      default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
  
    @UpdateDateColumn({
      type: 'timestamp',
      name: 'updated_at',
      default: () => 'CURRENT_TIMESTAMP'
    })
    updatedAt: Date;
  
    @DeleteDateColumn({
      type: 'timestamp',
      name: 'deleted_at',
      nullable: true
    })
    deletedAt: Date | null;
  }