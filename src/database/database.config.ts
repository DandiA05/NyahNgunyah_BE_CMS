import * as dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
dotenv.config();

// const config: PostgresConnectionOptions = {
//   type: 'postgres',
//   host: process.env.DATABASE_HOST,
//   port: +process.env.DATABASE_PORT,
//   username: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASS,
//   database: process.env.DATABASE_NAME,
//   ssl:
//     process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
//   extra: {
//     charset: 'utf8mb4_unicode_ci',
//   },
//   entities: ['dist/**/*.entity{.ts,.js}'],
//   migrations: ['dist/database/migrations/*{.ts,.js}'],
//   migrationsRun: +process.env.DATABASE_SYNC !== 1,
//   migrationsTableName: 'migrations',
//   synchronize: +process.env.DATABASE_SYNC === 1,
//   logging: true,
// };
// export default config;

const config: PostgresConnectionOptions = {
  type: 'postgres',
  // ✅ PAKAI DATABASE_URL
  url: process.env.DATABASE_URL,

  // ✅ SSL wajib untuk Neon
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  entities: ['dist/**/*.entity{.ts,.js}'],

  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: +process.env.DATABASE_SYNC !== 1,

  migrationsTableName: 'migrations',
  synchronize: +process.env.DATABASE_SYNC === 1,
  logging: true,
};
export default config;
