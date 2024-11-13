import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { typeOrmConfig } from './config/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WooApiModule } from './wooApi/wooApi.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [typeOrmConfig],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) =>
                configService.get('typeorm'),
        }),
        WooApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
