import { BadRequestException, Injectable } from '@nestjs/common'
import { s3 } from 'src/config/aws.config'

@Injectable()
export class S3Service {
    async uploadEvidenceFile(
        providerId: number,
        orderId: number,
        type: string,
        file: Express.Multer.File,
        bucketName: string,
    ): Promise<string> {
        if (!file) {
            throw new BadRequestException('No se recibió ningún archivo.')
        }

        const uploadParams = {
            Bucket: bucketName,
            Key: `orders/seller-${providerId}/O-${orderId}/${type}_evidence_${orderId}_${Date.now()}`, // Nombre único para el archivo
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
