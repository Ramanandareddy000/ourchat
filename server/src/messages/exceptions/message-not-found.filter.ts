import { ExceptionFilter, Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { Response } from 'express';
import { MessageNotFoundException } from '../exceptions/message-not-found.exception';

@Catch(MessageNotFoundException)
export class MessageNotFoundExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(MessageNotFoundExceptionFilter.name);

  catch(exception: MessageNotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;

    this.logger.warn(`Message not found: ${message}`, {
      url: request.url,
      method: request.method,
    });

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
    });
  }
}
