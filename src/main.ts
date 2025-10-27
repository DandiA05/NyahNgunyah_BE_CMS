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
    origin: '*',
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
