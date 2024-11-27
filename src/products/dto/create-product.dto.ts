import { ApiProperty } from "@nestjs/swagger"
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator"

export class Category {
    id: number
}

export class Tag {
    id: number
}

export class Image {
    id: number
    src: string
}

export class CreateProductDto {
    @ApiProperty({
        description: 'Nombre del producto a crear',
        example: 'Producto 1',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    name: string

    @ApiProperty({
        description: 'Tipo de producto a crear',
        example: 'simple',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    type: string

    @ApiProperty({
        description: 'Precio del producto a crear',
        example: 100000,
        type: Number,
    })
    @IsNotEmpty()
    @IsNumber()
    regular_price: number

    @ApiProperty({
        description: 'Descripción del producto a crear',
        example: 'Descripción del producto',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    description: string

    @ApiProperty({
        description: 'Descripción corta del producto a crear',
        example: 'Descripción producto',
        type: String,
    })
    @IsNotEmpty()
    @IsString()
    short_description: string

    @ApiProperty({
        description: 'Código de barras del producto a crear',
        example: '123456789',
        type: String,
    })
    @IsOptional()
    @IsString()
    sku?: string
    
    @ApiProperty({
        description: 'Stock del producto a crear',
        example: 10,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    stock_quantity?: number
    
    @ApiProperty({
        description: 'El producto a crear maneja stock o no',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    manege_stock?: boolean
    
    @ApiProperty({
        description: 'Estado del producto a crear',
        example: 'publish',
        type: String,
    })
    @IsOptional()
    @IsString()
    status?: string
    
    @ApiProperty({
        description: 'Categorias del producto a crear',
        example: [{ id: 1 }, { id: 2 }],
        type: [Category],
    })
    @IsArray()
    categories?: Category[]
    
    @ApiProperty({
        description: 'Etiquetas del producto a crear',
        example: [{ id: 1 }, { id: 2 }],
        type: [Tag],
    })
    @IsArray()
    tags?: Tag[]
    
    @ApiProperty({
        description: 'Imágenes del producto a crear',
        example: [{ id: 1 }, { scr: 'https://example.com/image.jpg' }],
        type: [Image],
    })
    @IsArray()
    images?: Partial<Image>[]
}