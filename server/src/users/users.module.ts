import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { UsersController } from './users.controller';
import { AuthController } from './auth.controller';
import { ProfileController } from './profile.controller';
import { AuthGuard } from './auth.guard';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserNotFoundExceptionFilter } from './exceptions/user-not-found.filter';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [
    UserService,
    JwtService,
    AuthGuard,
    {
      provide: 'APP_FILTER',
      useClass: UserNotFoundExceptionFilter,
    },
  ],
  controllers: [UsersController, AuthController, ProfileController],
  exports: [UserService, JwtService, AuthGuard],
})
export class UsersModule {}
