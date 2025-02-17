import { PartialType } from '@nestjs/mapped-types';
import { Category, CreateProductDto, Image, Tag } from './create-product.dto';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @ApiProperty({
        description: 'Nuevo nombre del producto a editar',
        example: 'Producto 1',
        type: String,
    })
    @IsOptional()
    @IsString()
    name?: string

    @ApiProperty({
        description: 'Nuevo tipo de producto a editar',
        example: 'simple',
        type: String,
    })
    @IsOptional()
    @IsString()
    type?: string

    @ApiProperty({
        description: 'Nuevo precio del producto a editar',
        example: 100000,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    regular_price?: number

    @ApiProperty({
        description: 'Nuevo precio del producto a editar',
        example: 100000,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    price?: number

    @ApiProperty({
        description: 'Nueva descripción del producto a editar',
        example: 'Descripción del producto',
        type: String,
    })
    @IsOptional()
    @IsString()
    description?: string

    @ApiProperty({
        description: 'Nueva descripción corta del producto a editar',
        example: 'Descripción producto',
        type: String,
    })
    @IsOptional()
    @IsString()
    short_description?: string

    @ApiProperty({
        description: 'Nuevo SKU del producto a editar',
        example: '123456789',
        type: String,
    })
    @IsOptional()
    @IsString()
    sku?: string
    
    @ApiProperty({
        description: 'Nuevo stock del producto a editar',
        example: 10,
        type: Number,
    })
    @IsOptional()
    @IsNumber()
    stock_quantity?: number
    
    @ApiProperty({
        description: 'Nuevo manejo de stock del producto a editar',
        example: true,
        type: Boolean,
    })
    @IsOptional()
    @IsBoolean()
    manege_stock?: boolean
    
    @ApiProperty({
        description: 'Nuevo estado del producto a editar',
        example: 'publish',
        type: String,
    })
    @IsString()
    status?: string

    @ApiProperty()
    @IsString()
    city?: string

    @ApiProperty()
    @IsString()
    state?: string
    
    @ApiProperty({
        description: 'Nuevas categorías del producto a editar',
        example: [{ id: 1 }, { id: 2 }],
        type: [Category],
    })
    @IsArray()
    categories?: Category[]
    
    @ApiProperty({
        description: 'Nuevas etiquetas del producto a editar',
        example: [{ id: 1 }, { id: 2 }],
        type: [Tag],
    })
    @IsArray()
    tags?: Tag[]
    
    @ApiProperty({
        description: 'Nuevas imágenes del producto a editar',
        example: [{ id: 1 }, { scr: 'https://example.com/image.jpg' }],
        type: [Image],
    })
    @IsOptional()
    @IsArray()
    images?: Partial<Image>[]
}
