import { DocumentBuilder } from "@nestjs/swagger";

export const swaggerConfig = new DocumentBuilder()
    .setTitle('Saldu API')
    .setDescription('Esta es una API construida con NestJS y PostgreSQL para el manejo de productos y ordenes de compra que tengan en la tienda Saldu.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();