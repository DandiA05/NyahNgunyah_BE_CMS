import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './helper/response/http-exception.filter';
import { seedInitialUser } from './seeders/create-initial-user.seed';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    allowedHeaders: '*',
    origin: [
      'https://nyahngunyahfecms-production.up.railway.app', // FE CMS prod
      'https://nyahngunyah-production.up.railway.app/',
      'http://localhost:5000', // FE CMS lokal
      'http://localhost:4000', // FE CMS lokal

    ],
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
