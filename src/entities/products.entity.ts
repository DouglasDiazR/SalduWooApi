import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Users } from './users.entity'

@Entity({
    name: 'products',
})
export class Products {
    @PrimaryColumn({
        type: 'int',
        unique: true,
    })
    id: number

    @Column({
        type: 'varchar',
    })
    name: string

    @Column({
        type: 'varchar'
    })
    slug: string

    @Column({
        type: 'varchar'
    })
    permalink: string

    @Column({
        type: 'varchar'
    })
    date_created: string

    @Column({
        type: 'varchar'
    })
    date_created_gmt: string

    @Column({
        type: 'varchar'
    })
    date_modified: string

    @Column({
        type: 'varchar'
    })
    date_modified_gmt: string

    @Column({
        type: 'varchar',
    })
    type: string

    @Column({
        type: 'varchar',
    })
    status: string

    @Column({
        type: 'boolean',
    })
    featured: boolean

    @Column({
        type: 'varchar',
    })
    catalog_visibility: string

    @Column({
        type: 'text',
    })
    description: string

    @Column({
        type: 'varchar',
    })
    short_description: string

    @Column({
        type: 'varchar',
    })
    sku: string

    @Column({
        type: 'float',
    })
    price: number

    @Column({
        type: 'float',
    })
    regular_price: number

    @Column({
        type: 'float'
    })
    sale_price: number

    @Column({
        type: 'varchar'
    })
    date_on_sale_from: string
    
    @Column({
        type: 'varchar'
    })
    date_on_sale_from_gmt: string


    @Column({
        type: 'varchar'
    })
    date_on_sale_to: string

    @Column({
        type: 'varchar'
    })
    date_on_sale_to_gmt: string

    @Column({
        type: 'boolean'
    })
    on_sale: boolean

    @Column({
        type: 'boolean'
    })
    purchasable: boolean

    @Column({
        type: 'int'
    })
    total_sales: number

    @Column({
        type: 'boolean'
    })
    virtual: boolean

    @Column({
        type: 'boolean'
    })
    downloadable: boolean

    @Column({
        type: 'json'
    })
    downloads: any[]

    @Column({
        type: 'int'
    })
    download_limit: number

    @Column({
        type: 'int'
    })
    download_expiry: number

    @Column({
        type: 'varchar'
    })
    external_url: string

    @Column({
        type: 'varchar'
    })
    button_text: string

    @Column({
        type: 'varchar'
    })
    tax_status: string

    @Column({
        type: 'varchar'
    })
    tax_class: string

    @Column({
        type: 'boolean'
    })
    manage_stock: boolean

    @Column({
        type: 'int'
    })
    stock_quantity: number

    @Column({
        type: 'varchar'
    })
    backorders: string

    @Column({
        type: 'boolean'
    })
    backorders_allowed: boolean

    @Column({
        type: 'boolean'
    })
    backordered: boolean

    @Column({
        type: 'varchar'
    })
    low_stock_amount: string

    @Column({
        type: 'boolean'
    })
    sold_individually: boolean

    @Column({
        type: 'varchar'
    })
    weight: string

    @Column({
        type: 'json'
    })
    dimensions: any[]

    @Column({
        type: 'boolean'
    })
    shipping_required: boolean

    @Column({
        type: 'boolean'
    })
    shipping_taxable: boolean

    @Column({
        type: 'varchar'
    })
    shipping_class: string

    @Column({
        type: 'int'
    })
    shipping_class_id: number

    @Column({
        type: 'boolean'
    })
    reviews_allowed: boolean

    @Column({
        type: 'varchar'
    })
    average_rating: string

    @Column({
        type: 'int'
    })
    rating_count: number

    @Column({
        type: 'json'
    })
    upsell_ids: any[]

    @Column({
        type: 'json'
    })
    cross_sell_ids: any[]

    @Column({
        type: 'int'
    })
    parent_id: number

    @Column({
        type: 'varchar'
    })
    purchase_note: string

    @Column({
        type: 'json'
    })
    categories: any[]

    @Column({
        type: 'json'
    })
    tags: any[]

    @Column({
        type: 'json'
    })
    images: any[]

    @Column({
        type: 'json'
    })
    attributes: any[]

    @Column({
        type: 'json'
    })
    default_attributes: any[]

    @Column({
        type: 'json'
    })
    variations: any[]

    @Column({
        type: 'json'
    })
    grouped_products: any[]

    @Column({
        type: 'int'
    })
    menu_order: number

    @Column({
        type: 'varchar'
    })
    price_html: string

    @Column({
        type: 'json'
    })
    related_ids: any[]

    @Column({
        type: 'json'
    })
    meta_data: any[]

    @Column({
        type: 'varchar'
    })
    stock_status: string

    @Column({
        type: 'boolean'
    })
    has_options: boolean

    @Column({
        type: 'varchar'
    })
    post_password: string

    @Column({
        type: 'varchar'
    })
    global_unique_id: string

    @Column({
        type: 'json'
    })
    aioseo_notices: any[]

    @Column({
        type: 'boolean'
    })
    jetpack_sharing_enabled: boolean

    @Column({
        type: 'json'
    })
    _links: any[]

    @ManyToOne(() => Users, (user) => user.products, { nullable: true })
    @JoinColumn({ name: 'customer_id' })
    user?: Users | null
}
