import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity({
    name: 'products'
})
export class Products {
    @PrimaryColumn()
    id: number

    @Column()
    name: string

    @Column()
    permalink: string

    @Column()
    type: string

    @Column()
    status: string

    @Column()
    featured: boolean

    @Column()
    catalog_visibility: string

    @Column()
    description: string
}
