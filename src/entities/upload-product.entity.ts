import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Load } from './load.entity'

@Entity('upload_products')
export class UploadProduct {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        name: 'provider_id',
        nullable: true,
        default: 0,
    })
    providerId: number

    @Column({
        type: 'varchar',
        name: 'sku',
        nullable: false,
        unique: false,
    })
    sku: string

    @Column({
        type: 'varchar',
        name: 'sku_saldu',
        nullable: false,
        unique: true,
    })
    sku_saldu: string

    @Column({
        type: 'varchar',
        name: 'name',
        nullable: false
    })
    name: string

    @Column({
        type: 'varchar',
        name: 'description',
        nullable: true,
    })
    description: string

    @Column({
        type: 'varchar',
        name: 'short_description',
        nullable: true,
    })
    shortDescription: string

    @Column({
        type: 'int',
        name: 'stock',
        nullable: false,
        default: 0,
    })
    stock: number

    @Column({
        type: 'varchar',
        name: 'unit',
        nullable: true,
        default: 'Unidad',
    })
    unit: string

    @Column({
        type: 'int',
        name: 'weight_kg',
        nullable: false,
        default: 0,
    })
    weightKg: number

    @Column({
        type: 'int',
        name: 'length_cm',
        nullable: false,
        default: 0,
    })
    lengthCm: number

    @Column({
        type: 'int',
        name: 'width_cm',
        nullable: false,
        default: 0,
    })
    widthCm: number

    @Column({
        type: 'int',
        name: 'height_cm',
        nullable: false,
        default: 0,
    })
    heightCm: number

    @Column({
        type: 'varchar',
        name: 'type',
        nullable: true,
    })
    type: string

    @Column({
        type: 'int',
        name: 'pvp',
        nullable: true,
        default: null,
    })
    pvp: number

    @Column({
        type: 'int',
        name: 'base_price',
        nullable: false,
        default: 0,
    })
    basePrice: number

    @Column({
        type: 'int',
        name: 'iva',
        nullable: true,
        default: 0,
    })
    iva: number

    @Column({
        type: 'int',
        name: 'base_iva',
        nullable: false,
        default: 0,
    })
    baseIva: number

    @Column({
        type: 'int',
        name: 'saldu_commission',
        nullable: false,
        default: 0,
    })
    salduCommission: number

    @Column({
        type: 'int',
        name: 'commission_iva',
        nullable: false,
        default: 0,
    })
    commissionIva: number

    @Column({
        type: 'int',
        name: 'final_price',
        nullable: false,
        default: 0,
    })
    finalPrice: number

    @Column({
        type: 'varchar',
        name: 'categories',
        nullable: true,
    })
    categories: string

    @Column({
        type: 'varchar',
        name: 'brand',
        nullable: true,
    })
    brand: string

    @Column({
        type: 'varchar',
        name: 'images_url',
        nullable: true,
    })
    imagesUrl: string

    @Column({
        type: 'varchar',
        name: 'status',
        nullable: true,
    })
    status: string

    @Column({
        type: 'varchar',
        name: 'address',
        nullable: true,
    })
    address: string

    @Column({
        type: 'varchar',
        name: 'city',
        nullable: true,
    })
    city: string

    @Column({
        type: 'varchar',
        name: 'state',
        nullable: true,
    })
    state: string

    @Column({
        type: 'timestamp',
        name: 'due_date',
        nullable: true,
    })
    dueDate: Date | null

    @Column({
        type: 'varchar',
        name: 'macrocategory',
        nullable: true,
    })
    macrocategory: string

    @Column({
        type: 'varchar',
        name: 'category',
        nullable: true,
    })
    category: string

    @Column({
        type: 'varchar',
        name: 'subcategory',
        nullable: true,
    })
    subcategory: string

    @Column({
        type: 'varchar',
        name: 'class',
        nullable: true,
    })
    class: string

    @Column({
        type: 'varchar',
        name: 'price_url1',
        nullable: true,
    })
    priceUrl1: string

    @Column({
        type: 'varchar',
        name: 'price_url2',
        nullable: true,
    })
    priceUrl2: string

    @Column({
        type: 'varchar',
        name: 'price_url3',
        nullable: true,
    })
    priceUrl3: string

    @Column({
        type: 'varchar',
        name: 'url_image1',
        nullable: true,
    })
    urlImage1: string

    @Column({
        type: 'varchar',
        name: 'url_image2',
        nullable: true,
    })
    urlImage2: string

    @Column({
        type: 'varchar',
        name: 'url_image3',
        nullable: true,
    })
    urlImage3: string

    @Column({
        type: 'varchar',
        name: 'url_image4',
        nullable: true,
    })
    urlImage4: string

    @Column({
        type: 'varchar',
        name: 'url_image5',
        nullable: true,
    })
    urlImage5: string

    @ManyToOne(() => Load, (load) => load.uploadProducts)
    load: Load

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
