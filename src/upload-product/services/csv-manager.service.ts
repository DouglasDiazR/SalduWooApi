import { Injectable, Logger } from '@nestjs/common'
import { parse } from 'csv-parse'
import { Readable } from 'stream'
import { CreateUploadProductDTO } from '../dtos/upload-product.dto'

@Injectable()
export class CsvManagerService {
    headerMap: Record<string, string> = {
        SKU: 'SKU',
        Descripción: 'description',
        'Descripción corta': 'shortDescription',
        Inventario: 'stock',
        Unidad: 'unit',
        'Peso (kg)': 'weightKg',
        'Longitud (cm)': 'lengthCm',
        'Anchura (cm)': 'widthCm',
        'Altura (cm)': 'heightCm',
        TIPO: 'type',
        'Precio Base': 'basePrice',
        'Iva Base': 'baseIva',
        'Comision Saldu': 'salduCommission',
        'Iva Comision': 'commissionIva',
        'Precio Final': 'finalPrice',
        Categorías: 'categories',
        Marca: 'brand',
        'Imágenes(URL)': 'imagesUrl',
        condicion: 'status',
        Direccion: 'address',
        Ciudad: 'city',
        Departamento: 'state',
        Iva: 'iva',
        'Fecha de vencimiento': 'dueDate',
        macrocategoria: 'macrocategory',
        categoria: 'category',
        subcategoria: 'subcategory',
        clase: 'class',
        cod_hash: 'codHash',
        price_url1: 'priceUrl1',
        price_url2: 'priceUrl2',
        price_url3: 'priceUrl3',
        url_image1: 'urlImage1',
        url_image2: 'urlImage2',
        url_image3: 'urlImage3',
        url_image4: 'urlImage4',
        url_image5: 'urlImage5',
    }

    renameHeaders(row: Record<string, any>): object {
        const renamedRow: Record<string, any> = {} // Nuevo objeto con las claves renombradas
        const keys = Object.keys(row) // Obtén todas las claves de la fila

        keys.forEach((header, index) => {
            if (index === 0) {
                // Si es la primera clave, asigna 'sku' como nueva clave
                renamedRow['sku'] = row[header]
            } else {
                // Para las demás claves, usa el mapeo o deja el nombre original
                const newHeader = this.headerMap[header] || header
                renamedRow[newHeader] = row[header]
            }
        })

        return { ...renamedRow } // Retorna el objeto renombrado
    }

    transformRowToProduct(row) {
        return {
            providerId: row.providerId ? parseInt(row.providerId, 10) : 0,
            sku: String(row.sku),
            description: String(row.description),
            shortDescription: row.shortDescription
                ? String(row.shortDescription)
                : undefined,
            stock: row.stock ? parseInt(row.stock, 10) : undefined,
            unit: row.unit ? String(row.unit) : undefined,
            weightKg: row.weightKg ? parseFloat(row.weightKg) : undefined,
            lengthCm: row.lengthCm ? parseFloat(row.lengthCm) : undefined,
            widthCm: row.widthCm ? parseFloat(row.widthCm) : undefined,
            heightCm: row.heightCm ? parseFloat(row.heightCm) : undefined,
            type: row.type ? String(row.type) : undefined,
            basePrice: row.basePrice ? parseFloat(row.basePrice) : 0,
            iva: row.iva ? parseFloat(row.iva) : undefined,
            baseIva: row.baseIva ? parseFloat(row.baseIva) : undefined,
            salduCommission: row.salduCommission
                ? parseFloat(row.salduCommission)
                : undefined,
            commissionIva: row.commissionIva
                ? parseFloat(row.commissionIva)
                : undefined,
            finalPrice: row.finalPrice ? parseFloat(row.finalPrice) : undefined,
            categories: row.categories ? String(row.categories) : undefined,
            brand: row.brand ? String(row.brand) : undefined,
            imagesUrl: row.imagesUrl ? String(row.imagesUrl) : undefined,
            status: String(row.status),
            address: row.address ? String(row.address) : undefined,
            city: String(row.city),
            state: String(row.state),
            dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
            macrocategory: row.macrocategory
                ? String(row.macrocategory)
                : undefined,
            category: row.category ? String(row.category) : undefined,
            subcategory: row.subcategory ? String(row.subcategory) : undefined,
            class: row.class ? String(row.class) : undefined,
            priceUrl1: row.priceUrl1 ? String(row.priceUrl1) : undefined,
            priceUrl2: row.priceUrl2 ? String(row.priceUrl2) : undefined,
            priceUrl3: row.priceUrl3 ? String(row.priceUrl3) : undefined,
            urlImage1: row.urlImage1 ? String(row.urlImage1) : undefined,
            urlImage2: row.urlImage2 ? String(row.urlImage2) : undefined,
            urlImage3: row.urlImage3 ? String(row.urlImage3) : undefined,
            urlImage4: row.urlImage4 ? String(row.urlImage4) : undefined,
            urlImage5: row.urlImage5 ? String(row.urlImage5) : undefined,
        }
    }

    processCsvBuffer(buffer: Buffer): Promise<CreateUploadProductDTO[]> {
        const stream = Readable.from(buffer)
        const records = []
        return new Promise((resolve, reject) => {
            stream
                .pipe(
                    parse({
                        columns: true,
                        delimiter: ';',
                        skipRecordsWithEmptyValues: true,
                        trim: true,
                    }),
                )
                .on('data', (row) => {
                    const renamedRow = this.renameHeaders(row)
                    const transformedRow = this.transformRowToProduct(renamedRow)
                    records.push(transformedRow)
                })
                .on('error', function (error) {
                    console.log(error)
                    reject(error)
                })
                .on('end', function () {
                    resolve(records)
                })
        })
    }
}
