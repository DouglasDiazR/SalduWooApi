import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
@Entity({
    name: 'customers',
})
export class Customers {
    @PrimaryGeneratedColumn('uuid')
    id_customers: string = uuid()

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    name: string

    @Column({
        type: 'varchar',
        length: 50,
        nullable: false,
        unique: true,
    })
    email: string

    @Column({
        type: 'varchar',
        length: 128,
        nullable: false,
    })
    password: string
}
