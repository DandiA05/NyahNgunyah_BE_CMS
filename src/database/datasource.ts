const { DataSource } = require('typeorm');
import * as dotenv from 'dotenv';
dotenv.config();

const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
  migrationsRun: +process.env.DATABASE_SYNC !== 1,
  migrationsTableName: 'migrations',
  entities: ['src/**/*.entity{.ts,.js}', 'src/**/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migration/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migration',
  },
  synchronize: +process.env.DATABASE_SYNC === 1,
  trace: true,
  logging: true,
});

dataSource.initialize();

module.exports = { dataSource };
