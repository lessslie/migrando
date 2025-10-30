// src/common/filters/http-exception.filter.ts
import { 
  ExceptionFilter, 
  Catch, 
  ArgumentsHost, 
  HttpException,
  HttpStatus,
  Logger 
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = 
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = 
      exception instanceof Error ? exception.message : 'Error interno del servidor';

    this.logger.error({
      message,
      statusCode: status,
      path: request.url,
      timestamp: new Date().toISOString(),
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}