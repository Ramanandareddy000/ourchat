import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../models';
import * as bcrypt from 'bcrypt';
import { IUsersService } from './users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements IUsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Hash the password before saving
    const user: any = { ...createUserDto };
    if (user.password) {
      user.password_hash = await bcrypt.hash(user.password, 10);
      delete user.password; // Remove plain text password
    }
    // Map DTO fields to model fields
    user.username = user.username;
    user.display_name = user.displayName;
    user.avatar_url = user.avatarUrl || null;
    delete user.displayName;
    delete user.avatarUrl;
    
    return this.userModel.create(user);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async findOneById(id: number): Promise<User | null> {
    return this.userModel.findByPk(id);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({
      where: {
        username,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const user = await this.findOneById(id);
    if (!user) {
      return null;
    }

    // Map DTO fields to model fields
    const updates: any = {};
    if (updateUserDto.username !== undefined) updates.username = updateUserDto.username;
    if (updateUserDto.password !== undefined) {
      updates.password_hash = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (updateUserDto.displayName !== undefined) updates.display_name = updateUserDto.displayName;
    if (updateUserDto.avatarUrl !== undefined) updates.avatar_url = updateUserDto.avatarUrl;

    return user.update(updates);
  }

  async delete(id: number): Promise<boolean> {
    const user = await this.findOneById(id);
    if (!user) {
      return false;
    }
    await user.destroy();
    return true;
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOneByUsername(username);
    if (!user) {
      return false;
    }
    return bcrypt.compare(password, user.password_hash);
  }
}
