import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const status = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const res = isHttpException ? exception.getResponse() : null;
    const payload =
      typeof res === 'object' && res !== null
        ? (res as { message?: string | string[]; error?: string })
        : { message: typeof res === 'string' ? res : undefined };

    const message = [payload.message ?? 'Erro interno do servidor'].flat();
    const error = payload.error ?? 'Internal Server Error';

    response.status(status).json({ statusCode: status, error, message });
  }
}
