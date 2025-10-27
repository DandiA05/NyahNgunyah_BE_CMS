import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user/user.module';
import { PegawaiModule } from './user/pegawai/pegawai.module';
import databaseConfig from './database/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './activity-log/activity-log.module';
import { CutiModule } from './cuti/cuti.module';
import { ProdukModule } from './produk/produk.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TransaksiModule } from './transaksi/transaksi.module';
import { DetailTransaksiModule } from './detail-transaksi/detail-transaksi.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    PegawaiModule,
    AuthModule,
    ActivityLogModule,
    CutiModule,
    ProdukModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), // Folder untuk akses file
      serveRoot: '/uploads', // Prefix URL
    }),
    TransaksiModule,
    DetailTransaksiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
