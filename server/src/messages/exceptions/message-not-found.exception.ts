import { HttpException, HttpStatus } from '@nestjs/common';

export class MessageNotFoundException extends HttpException {
  constructor(messageId?: number | string) {
    const message = messageId
      ? `Message with ID ${messageId} not found`
      : 'Message not found';
    super(message, HttpStatus.NOT_FOUND);
  }
}
