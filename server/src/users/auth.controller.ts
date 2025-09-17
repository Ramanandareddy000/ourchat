import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Logger,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './users.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import type { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      this.logger.log(`Login attempt for user: ${loginDto.username}`);

      // Validate user credentials
      const isValid = await this.userService.validatePassword(
        loginDto.username,
        loginDto.password,
      );

      if (!isValid) {
        this.logger.warn(
          `Invalid login attempt for user: ${loginDto.username}`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      // Get user details
      const user = await this.userService.findOneByUsername(loginDto.username);
      if (!user) {
        this.logger.error(
          `User not found after validation: ${loginDto.username}`,
        );
        throw new UnauthorizedException('User not found');
      }

      // Generate JWT token
      const token = this.jwtService.generateToken(user);

      this.logger.log(`Successful login for user: ${loginDto.username}`);
      return {
        token,
        user: user.toJSON(),
      };
    } catch (error) {
      this.logger.error(`Login error for user ${loginDto.username}:`, error);
      throw error;
    }
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: Partial<User> }> {
    try {
      this.logger.log(
        `Registration attempt for user: ${createUserDto.username}`,
      );

      // Create user
      const user = await this.userService.create(createUserDto);

      // Generate JWT token
      const token = this.jwtService.generateToken(user);

      this.logger.log(
        `Successful registration for user: ${createUserDto.username}`,
      );
      return {
        token,
        user: user.toJSON(),
      };
    } catch (error) {
      this.logger.error(
        `Registration error for user ${createUserDto.username}:`,
        error,
      );
      throw error;
    }
  }
}
