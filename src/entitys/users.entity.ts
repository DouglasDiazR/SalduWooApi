import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { v4 as uuid } from 'uuid'
@Entity({
    name: 'users',
})
export class Users {
    @PrimaryGeneratedColumn('uuid')
    id_user: string = uuid()

    @Column({
        type: 'int',
        unique: true,
        nullable: false,
    })
    id_wooCommerce: number

    @Column({
        type: 'varchar',
        length: 128,
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
    role: string

    @Column({ type: 'varchar', length: 128, nullable: false })
    password: string
}
