import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidUserIdException extends HttpException {
  constructor() {
    super('Invalid user ID provided', HttpStatus.BAD_REQUEST);
  }
}
