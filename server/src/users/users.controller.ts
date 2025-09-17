import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './users.service';
import { User } from '../models';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

@Controller('users')
@UsePipes(new ValidationPipe({ transform: true }))
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly userService: UserService) {
    this.logger.log('UsersController initialized');
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log('Received request to create user', createUserDto);
      const user = await this.userService.create(createUserDto);
      this.logger.log('User created successfully', user.toJSON());
      return user;
    } catch (error) {
      this.logger.error('Error creating user', error);
      throw error;
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Received request to fetch all users');
      const users = await this.userService.findAll();
      this.logger.log(`Returning ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Error fetching users', error);
      throw error;
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      this.logger.log(`Received request to fetch user with ID: ${id}`);
      const user = await this.userService.findOneById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      this.logger.log('User found:', user?.toJSON());
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}`, error);
      throw error;
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    try {
      this.logger.log(
        `Received request to update user with ID: ${id}`,
        updateUserDto,
      );
      const user = await this.userService.update(id, updateUserDto);
      if (!user) {
        throw new UserNotFoundException(id);
      }
      this.logger.log('User updated:', user?.toJSON());
      return user;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}`, error);
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      this.logger.log(`Received request to delete user with ID: ${id}`);
      const result = await this.userService.delete(id);
      if (!result) {
        throw new UserNotFoundException(id);
      }
      this.logger.log(`User with ID ${id} deleted successfully`);
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}`, error);
      throw error;
    }
  }
}
