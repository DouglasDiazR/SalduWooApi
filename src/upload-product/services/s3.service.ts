import { BadRequestException, Injectable } from '@nestjs/common'
import { s3 } from '../../config/aws.config'
import * as multerS3 from 'multer-s3'

@Injectable()
export class S3Service {
    async uploadFile(
        providerId: number,
        productId: number,
        file: Express.Multer.File,
        bucketName: string,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.')
        }

        const uploadParams = {
            Bucket: bucketName,
            Key: `provider-images/${providerId}/${productId}_${Date.now()}`, // Nombre único para el archivo
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
