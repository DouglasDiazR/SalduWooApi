import { config as dotenvConfig } from 'dotenv'
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USERNAME } from './envs'
import { registerAs } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'

dotenvConfig({ path: '.env' })

const config = {
    type: 'postgres',
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT as unknown as number,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    entities: ['dist/**/*.entity{.ts,.js}'],
    migrations: ['dist/migrations/*{.ts,.js}'],
    autoLoadEntities: true,
    logging: true,
    synchronize: true,
    dropSchema: true,
}

export const typeOrmConfig = registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions)
