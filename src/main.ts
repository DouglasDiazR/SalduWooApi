import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './config/envs'


async function bootstrap() {
    const app = await NestFactory.create(AppModule)
      // Habilitar CORS
      app.enableCors({
        origin: 'http://localhost:3000', // Permitir solicitudes desde tu frontend
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true, // Permitir envío de cookies si es necesario
      });
    await app.listen(PORT)
}
bootstrap()









