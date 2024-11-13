import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { PORT } from './config/envs'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    await app.listen(PORT ?? 3001)
}
bootstrap()
