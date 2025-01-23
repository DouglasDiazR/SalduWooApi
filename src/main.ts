import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT, PORT_FRONT } from './config/envs'
import { SwaggerModule } from '@nestjs/swagger'
import { swaggerConfig } from './config/swagger.config'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    console.log(PORT_FRONT)
    app.enableCors({
        origin: ['http://localhost:4200', PORT_FRONT],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    })
    const apiDocumentation = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('api', app, apiDocumentation)
    await app.listen(PORT)
    console.log(`Servidor corriendo en el puerto: ${PORT}`);
}
bootstrap()









