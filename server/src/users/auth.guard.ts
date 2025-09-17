import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from './jwt.service';
import { UserService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context
        .switchToHttp()
        .getRequest<Request & { user?: any }>();
      const token = this.extractTokenFromHeader(request);

      if (!token) {
        this.logger.warn('No token provided in request');
        throw new UnauthorizedException('No token provided');
      }

      // Verify token
      const payload = this.jwtService.verifyToken(token);

      // Get user from database
      const user = await this.userService.findOneById(payload.sub);
      if (!user) {
        this.logger.warn(`User not found for token with sub: ${payload.sub}`);
        throw new UnauthorizedException('User not found');
      }

      // Attach user to request
      request.user = user;
      return true;
    } catch (error) {
      this.logger.error('Authentication error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const authorizationHeader = (request.headers as { authorization?: string })
      ?.authorization;
    if (!authorizationHeader) {
      return undefined;
    }

    const [type, token] = authorizationHeader.split(' ');
    return type === 'Bearer' ? token : undefined;
  }
}
