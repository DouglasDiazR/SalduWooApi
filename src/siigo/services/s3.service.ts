import { BadRequestException, Injectable } from '@nestjs/common'
import { s3 } from '../../config/aws.config'

@Injectable()
export class S3Service {
    async uploadDisperssionFile(
        provider: string,
        orderId: number,
        file: Express.Multer.File,
        bucketName: string,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.')
        }
        console.log('s3service post file')
        const uploadParams = {
            Bucket: bucketName,
            Key: `invoicing/disperssion-receipts/${provider}/${orderId}_${Date.now()}`, // Nombre único para el archivo
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        try {
            const { Location } = await s3.upload(uploadParams).promise()
            console.log('s3service post s3 upload')
            return Location // URL del archivo en S3
        } catch (error) {
            throw new BadRequestException(
                `Error al subir archivo: ${error.message}`,
            )
        }
    }

    async uploadSiigoFile(
        providerId: number,
        orderId: number,
        file: Express.Multer.File,
        bucketName: string,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.')
        }

        const uploadParams = {
            Bucket: bucketName,
            Key: `invoicing/siigo-receipts/${providerId}/${orderId}_${Date.now()}`, // Nombre único para el archivo
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        try {
            const { Location } = await s3.upload(uploadParams).promise()
            return Location // URL del archivo en S3
        } catch (error) {
            throw new BadRequestException(
                `Error al subir archivo: ${error.message}`,
            )
        }
    }
}
