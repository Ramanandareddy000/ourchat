import { HttpException, HttpStatus } from '@nestjs/common';

export class UserNotFoundException extends HttpException {
  constructor(userId?: number | string) {
    const message = userId
      ? `User with ID ${userId} not found`
      : 'User not found';
    super(message, HttpStatus.NOT_FOUND);
  }
}
