import { Controller, Get, UseGuards, Request, Logger } from '@nestjs/common';
import { AuthGuard } from '../users/auth.guard';
import { User } from '../models';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('profile')
export class ProfileController {
  private readonly logger = new Logger(ProfileController.name);

  @UseGuards(AuthGuard)
  @Get('me')
  getProfile(@Request() req: AuthenticatedRequest): { user: Partial<User> } {
    try {
      this.logger.log(`Profile request for user: ${req.user.username}`);
      return { user: req.user.toJSON() };
    } catch (error) {
      this.logger.error('Error fetching profile:', error);
      throw error;
    }
  }
}
