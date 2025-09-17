import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { User } from '../models';

export interface JwtPayload {
  sub: number;
  username: string;
}

@Injectable()
export class JwtService {
  private readonly logger = new Logger(JwtService.name);

  constructor(private configService: ConfigService) {}

  generateToken(user: User): string {
    try {
      const username = user.username;

      const payload: JwtPayload = {
        sub: user.id,
        username: username,
      };

      const secret =
        this.configService.get<string>('JWT_SECRET') || 'default_secret';

      // Get expiresIn as string
      const expiresIn =
        this.configService.get<string>('JWT_EXPIRES_IN') || '24h';

      this.logger.log(`Generating JWT token for user: ${username}`);

      // Type assertion to work with the specific version of @types/jsonwebtoken
      const options = { expiresIn } as jwt.SignOptions;
      const token = jwt.sign(payload, secret, options);

      this.logger.log(`JWT token generated successfully for user: ${username}`);
      return token;
    } catch (error) {
      const username = user.username || 'unknown';
      this.logger.error(
        `Error generating JWT token for user ${username}:`,
        error,
      );
      throw error;
    }
  }

  verifyToken(token: string): JwtPayload {
    try {
      const secret =
        this.configService.get<string>('JWT_SECRET') || 'default_secret';
      this.logger.log('Verifying JWT token');

      // Using type assertion to work with the specific version of @types/jsonwebtoken
      const decoded = jwt.verify(token, secret);

      // Type guard to check if decoded is a JwtPayload
      if (this.isJwtPayload(decoded)) {
        this.logger.log('JWT token verified successfully');
        return decoded;
      } else {
        throw new Error('Invalid token structure');
      }
    } catch (error) {
      this.logger.error('Error verifying JWT token:', error);
      throw error;
    }
  }

  // Type guard to check if the decoded object matches our JwtPayload interface
  private isJwtPayload(obj: any): obj is JwtPayload {
    // Use type-safe checks to avoid ESLint warnings
    if (typeof obj !== 'object' || obj === null) {
      return false;
    }

    const hasSub =
      'sub' in obj && typeof (obj as Record<string, unknown>).sub === 'number';
    const hasUsername =
      'username' in obj &&
      typeof (obj as Record<string, unknown>).username === 'string';

    return hasSub && hasUsername;
  }
}
