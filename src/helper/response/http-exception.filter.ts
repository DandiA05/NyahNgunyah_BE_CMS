import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Request, Response } from 'express';
import { BadRequestException } from '@nestjs/common';

@Catch(BadRequestException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // Mengambil pesan dari BadRequestException
    const message = exception.message;

    response.status(400).json({
      statusCode: 400,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message, // Mengirimkan pesan kesalahan yang sesuai
    });
  }
}
