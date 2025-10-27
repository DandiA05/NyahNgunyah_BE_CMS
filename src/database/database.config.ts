import * as dotenv from 'dotenv';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
dotenv.config();

const config: MysqlConnectionOptions = {
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: +process.env.DATABASE_SYNC !== 1,
  migrationsTableName: 'migrations',
  synchronize: +process.env.DATABASE_SYNC === 1,
  trace: true,
  logging: true,
  //logging: ['error'],
};
export default config;
