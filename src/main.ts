import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpExceptionFilter } from './helper/response/http-exception.filter';
import express from 'express';

const expressApp = express();
let nestApp: any;

async function bootstrap() {
  if (nestApp) return nestApp;

  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: [
      'https://nyah-ngunyah-fe-cms.vercel.app',
      'https://nyahngunyah.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.init();
  nestApp = app;
  return nestApp;
}

if (!process.env.VERCEL) {
  bootstrap().then(async (app) => {
    await app.listen(process.env.PORT || 3000);
  });
}

export default async (req: any, res: any) => {
  await bootstrap();
  expressApp(req, res);
};
