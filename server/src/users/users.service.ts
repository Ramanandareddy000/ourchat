import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models';
import * as bcrypt from 'bcrypt';
import { IUsersService } from './users.interface';
import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements IUsersService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    this.logger.log('UserService initialized');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      this.logger.log('Creating user with data:', createUserDto);

      // Prepare user data for creation
      // Note: Do not manually set the ID as it's auto-incremented by the database
      const userData: Partial<User> = {
        username: createUserDto.username,
        display_name: createUserDto.displayName,
        avatar_url: createUserDto.avatarUrl || undefined,
      };

      // Hash the password before saving
      if (createUserDto.password) {
        userData.password_hash = await bcrypt.hash(createUserDto.password, 10);
      }

      this.logger.log('Prepared user data:', userData);
      const user = await this.userModel.create(userData);
      this.logger.log('User created successfully:', user.toJSON());
      return user;
    } catch (error) {
      this.logger.error('Error creating user:', error);
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    try {
      this.logger.log('Fetching all users');
      const users = await this.userModel.findAll();
      this.logger.log(`Found ${users.length} users`);
      return users;
    } catch (error) {
      this.logger.error('Error fetching users:', error);
      throw error;
    }
  }

  async findOneById(id: number): Promise<User | null> {
    try {
      this.logger.log(`Fetching user with ID: ${id}`);
      const user = await this.userModel.findByPk(id);
      this.logger.log('User found:', user?.toJSON());
      return user;
    } catch (error) {
      this.logger.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  async findOneByUsername(username: string): Promise<User | null> {
    try {
      this.logger.log(`Fetching user with username: ${username}`);
      const user = await this.userModel.findOne({
        where: {
          username,
        },
      });
      this.logger.log('User found:', user?.toJSON());
      return user;
    } catch (error) {
      this.logger.error(
        `Error fetching user with username ${username}:`,
        error,
      );
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    try {
      this.logger.log(`Updating user with ID: ${id}`, updateUserDto);
      const user = await this.findOneById(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        return null;
      }

      // Map DTO fields to model fields
      const updates: Partial<User> = {};
      if (updateUserDto.username !== undefined)
        updates.username = updateUserDto.username;
      if (updateUserDto.password !== undefined) {
        updates.password_hash = await bcrypt.hash(updateUserDto.password, 10);
      }
      if (updateUserDto.displayName !== undefined)
        updates.display_name = updateUserDto.displayName;
      if (updateUserDto.avatarUrl !== undefined)
        updates.avatar_url = updateUserDto.avatarUrl;

      const updatedUser = await user.update(updates);
      this.logger.log('User updated successfully:', updatedUser.toJSON());
      return updatedUser;
    } catch (error) {
      this.logger.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      this.logger.log(`Deleting user with ID: ${id}`);
      const user = await this.findOneById(id);
      if (!user) {
        this.logger.warn(`User with ID ${id} not found`);
        return false;
      }
      await user.destroy();
      this.logger.log(`User with ID ${id} deleted successfully`);
      return true;
    } catch (error) {
      this.logger.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    try {
      this.logger.log(`Validating password for user: ${username}`);
      const user = await this.findOneByUsername(username);
      if (!user) {
        this.logger.warn(`User ${username} not found for password validation`);
        return false;
      }

      // Log the values we're going to compare for debugging
      this.logger.log(`Password provided: ${!!password}`);
      this.logger.log(`Password hash from user: ${!!user.password_hash}`);

      // Access password_hash directly from the model instance, not from toJSON()
      const passwordHash = user.password_hash;
      if (!passwordHash) {
        this.logger.error(`Password hash not found for user ${username}`);
        return false;
      }

      if (!password) {
        this.logger.error(`Password not provided for user ${username}`);
        return false;
      }

      this.logger.log(`Comparing password with hash for user: ${username}`);
      const isValid = await bcrypt.compare(password, passwordHash);
      this.logger.log(`Password validation result for ${username}: ${isValid}`);
      return isValid;
    } catch (error) {
      this.logger.error(
        `Error validating password for user ${username}:`,
        error,
      );
      throw error;
    }
  }

  async updateOnlineStatus(userId: number, isOnline: boolean): Promise<void> {
    try {
      this.logger.log(`Updating online status for user ${userId}: ${isOnline}`);
      await this.userModel.update(
        {
          online: isOnline,
          last_seen: isOnline ? null : new Date().toISOString(),
        },
        {
          where: { id: userId },
        },
      );
      this.logger.log(`Online status updated for user ${userId}`);
    } catch (error) {
      this.logger.error(
        `Error updating online status for user ${userId}:`,
        error,
      );
      throw error;
    }
  }
}
