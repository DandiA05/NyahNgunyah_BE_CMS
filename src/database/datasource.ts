const { DataSource } = require('typeorm');
import * as dotenv from 'dotenv';
dotenv.config();

const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
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
