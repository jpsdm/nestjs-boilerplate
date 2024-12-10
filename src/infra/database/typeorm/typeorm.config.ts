import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const ORM_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: ['query', 'error'],
  autoLoadEntities: true,
  migrations: [`dist/infra/database/migrations/*{.ts,.js}`],
} as TypeOrmModuleOptions;

export default ORM_CONFIG;
