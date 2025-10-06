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
  BadRequestException,
} from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { UserService } from './users.service';
import { JwtService } from './jwt.service';
import type { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, RegisterDto } from './dto';
import { ValidationError } from 'sequelize';

@Controller('auth')
@UsePipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      const errorMessage = errors
        .map((error) => Object.values(error.constraints || {}).join(', '))
        .join(', ');
      return new BadRequestException(errorMessage || 'Validation failed');
    },
  }),
)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ token: string; user: any }> {
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
        throw new UnauthorizedException(
          await this.i18n.translate('auth.errors.invalidCredentials')
        );
      }

      // Get user details
      const user = await this.userService.findOneByUsername(loginDto.username);
      if (!user) {
        this.logger.error(
          `User not found after validation: ${loginDto.username}`,
        );
        throw new UnauthorizedException(
          await this.i18n.translate('auth.errors.userNotFound')
        );
      }

      // Generate JWT token
      const token = this.jwtService.generateToken(user);

      this.logger.log(`Successful login for user: ${loginDto.username}`);
      return {
        token,
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
        },
      };
    } catch (error) {
      this.logger.error(`Login error for user ${loginDto.username}:`, error);
      throw error;
    }
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ token: string; user: any }> {
    try {
      // Transform RegisterDto to CreateUserDto
      const createUserDto: CreateUserDto = {
        username: registerDto.username,
        password: registerDto.password,
        displayName: registerDto.displayName,
      };

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
        user: {
          id: user.id,
          username: user.username,
          display_name: user.display_name,
          avatar_url: user.avatar_url,
        },
      };
    } catch (error: unknown) {
      this.logger.error(
        `Registration error for user ${registerDto.username}:`,
        error,
      );

      // Handle specific error types
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle validation errors
      if (error instanceof ValidationError) {
        const errorMessage =
          error.errors?.map((err) => err.message).join(', ') ||
          'Validation error';
        throw new BadRequestException(
          await this.i18n.translate('auth.errors.registrationFailed', {
            args: { reason: errorMessage }
          })
        );
      }

      // Handle other errors
      if (error instanceof Error) {
        throw new BadRequestException(
          await this.i18n.translate('auth.errors.registrationFailed', {
            args: { reason: error.message }
          })
        );
      }

      throw new BadRequestException(
        await this.i18n.translate('auth.errors.registrationFailed', {
          args: { reason: 'Unknown error' }
        })
      );
    }
  }
}
