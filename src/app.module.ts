import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { typeOrmConfig } from './config/typeorm'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WooApiModule } from './wooApi/wooApi.module'
import { AuthModule } from './auth/auth.module'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from './config/envs'
import { UsersModule } from './users/users.module'
import { ProductsModule } from './products/products.module';

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
        UsersModule,
        WooApiModule,
        AuthModule,
        JwtModule.register({
            global: true,
            signOptions: { expiresIn: '1h' },
            secret: JWT_SECRET,
        }),
        ProductsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
