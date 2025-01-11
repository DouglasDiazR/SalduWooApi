import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('upload_products')
export class UploadProduct {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'int',
        name: 'provider_id',
        nullable: true,
        default: 0
    })
    providerId: number

    @Column({
        type: 'varchar',
        name: 'sku',
        length: 64,
        nullable: false,
        unique: true
    })
    sku: string	
    
    @Column({
        type: 'varchar',
        name: 'description',
        length: 512,
        nullable: true,
    })
    description: string	
    
    @Column({
        type: 'varchar',
        name: 'short_description',
        length: 256,
        nullable: true,
    })
    shortDescription: string		
    
    @Column({
        type: 'int',
        name: 'stock',
        nullable: false,
        default: 0
    })
    stock: number	
    
    @Column({
        type: 'varchar',
        name: 'unit',
        length: 64,
        nullable: true,
        default: 'Unidad'
    })
    unit: string
    
    @Column({
        type: 'int',
        name: 'weight_kg',
        nullable: false,
        default: 0
    })
    weightKg: number

    @Column({
        type: 'int',
        name: 'length_cm',
        nullable: false,
        default: 0
    })
    lengthCm: number
    
    @Column({
        type: 'int',
        name: 'width_cm',
        nullable: false,
        default: 0
    })
    widthCm: number
    
    @Column({
        type: 'int',
        name: 'height_cm',
        nullable: false,
        default: 0
    })
    heightCm: number
    
    @Column({
        type: 'varchar',
        name: 'type',
        length: 128,
        nullable: true,
    })
    type:string
    
    @Column({
        type: 'int',
        name: 'base_price',
        nullable: false,
        default: 0
    })
    basePrice: number	
    
    @Column({
        type: 'int',
        name: 'iva',
        nullable: true,
        default: 0
    })
    iva: number

    @Column({
        type: 'int',
        name: 'base_iva',
        nullable: false,
        default: 0
    })
    baseIva: number	
    
    @Column({
        type: 'int',
        name: 'saldu_commission',
        nullable: false,
        default: 0
    })
    salduCommission: number	
    
    @Column({
        type: 'int',
        name: 'commission_iva',
        nullable: false,
        default: 0
    })
    commissionIva: number	
    
    @Column({
        type: 'int',
        name: 'final_price',
        nullable: false,
        default: 0
    })
    finalPrice: number
    
    @Column({
        type: 'varchar',
        name: 'categories',
        length: 256,
        nullable: true,
    })
    categories: string
    
    @Column({
        type: 'varchar',
        name: 'brand',
        length: 128,
        nullable: true,
    })
    brand: string
    
    @Column({
        type: 'varchar',
        name: 'images_url',
        length: 512,
        nullable: true,
    })
    imagesUrl: string
    
    @Column({
        type: 'varchar',
        name: 'status',
        length: 128,
        nullable: true,
    })
    status: string
    
    @Column({
        type: 'varchar',
        name: 'address',
        length: 256,
        nullable: true,
    })
    address: string
    
    @Column({
        type: 'varchar',
        name: 'city',
        length: 128,
        nullable: true,
    })
    city: string
    
    @Column({
        type: 'varchar',
        name: 'state',
        length: 128,
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
        length: 128,
        nullable: true,
    })
    macrocategory: string
    
    @Column({
        type: 'varchar',
        name: 'category',
        length: 128,
        nullable: true,
    })
    category: string
    
    @Column({
        type: 'varchar',
        name: 'subcategory',
        length: 128,
        nullable: true,
    })
    subcategory: string
    
    @Column({
        type: 'varchar',
        name: 'class',
        length: 128,
        nullable: true,
    })
    class: string
    
    @Column({
        type: 'varchar',
        name: 'price_url1',
        length: 512,
        nullable: true,
    })
	priceUrl1: string
    
    @Column({
        type: 'varchar',
        name: 'price_url2',
        length: 512,
        nullable: true,
    })
    priceUrl2: string
    
    @Column({
        type: 'varchar',
        name: 'price_url3',
        length: 512,
        nullable: true,
    })
    priceUrl3: string
    
    @Column({
        type: 'varchar',
        name: 'url_image1',
        length: 512,
        nullable: true,
    })
    urlImage1: string
    
    @Column({
        type: 'varchar',
        name: 'url_image2',
        length: 512,
        nullable: true,
    })
    urlImage2: string
    
    @Column({
        type: 'varchar',
        name: 'url_image3',
        length: 512,
        nullable: true,
    })
    urlImage3: string
    
    @Column({
        type: 'varchar',
        name: 'url_image4',
        length: 512,
        nullable: true,
    })
    urlImage4: string
    
    @Column({
        type: 'varchar',
        name: 'url_image5',
        length: 512,
        nullable: true,
    })
    urlImage5: string


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
