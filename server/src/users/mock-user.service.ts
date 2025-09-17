import { Injectable } from '@nestjs/common';
import { User } from '../models';
import { IUsersService } from './users.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Mock data for testing
const mockUsers: User[] = [
  {
    id: 1,
    username: 'testuser',
    password_hash: 'hashedpassword1',
    display_name: 'Test User',
    avatar_url: '',
    image: '',
    online: true,
    last_seen: new Date().toISOString(),
    phone: '',
    about: '',
    is_group: false,
    created_at: new Date(),
    updated_at: new Date(),
  } as User,
  {
    id: 2,
    username: 'johndoe',
    password_hash: 'hashedpassword2',
    display_name: 'John Doe',
    avatar_url: '',
    image: '',
    online: true,
    last_seen: new Date().toISOString(),
    phone: '',
    about: '',
    is_group: false,
    created_at: new Date(),
    updated_at: new Date(),
  } as User,
];

let nextId = 3;

@Injectable()
export class MockUserService implements IUsersService {
  create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      id: nextId++,
      username: createUserDto.username,
      password_hash: createUserDto.password,
      display_name: createUserDto.displayName,
      avatar_url: createUserDto.avatarUrl || '',
      image: '',
      online: true,
      last_seen: new Date().toISOString(),
      phone: '',
      about: '',
      is_group: false,
      created_at: new Date(),
      updated_at: new Date(),
    } as User;

    mockUsers.push(newUser);
    return Promise.resolve(newUser);
  }

  findAll(): Promise<User[]> {
    return Promise.resolve(mockUsers);
  }

  findOneById(id: number): Promise<User | null> {
    const user = mockUsers.find((user) => user.id === id);
    return Promise.resolve(user ? user : null);
  }

  findOneByUsername(username: string): Promise<User | null> {
    const user = mockUsers.find((user) => user.username === username);
    return Promise.resolve(user ? user : null);
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return Promise.resolve(null);
    }

    // Get the existing user
    const existingUser = mockUsers[userIndex];

    // Create updated user object with all required fields
    const updatedUser = {
      id: existingUser.id,
      username:
        updateUserDto.username !== undefined
          ? updateUserDto.username
          : existingUser.username,
      password_hash:
        updateUserDto.password !== undefined
          ? updateUserDto.password
          : existingUser.password_hash,
      display_name:
        updateUserDto.displayName !== undefined
          ? updateUserDto.displayName
          : existingUser.display_name,
      avatar_url:
        updateUserDto.avatarUrl !== undefined
          ? updateUserDto.avatarUrl
          : existingUser.avatar_url,
      image: existingUser.image,
      online: existingUser.online,
      last_seen: existingUser.last_seen,
      phone: existingUser.phone,
      about: existingUser.about,
      is_group: existingUser.is_group,
      created_at: existingUser.created_at,
      updated_at: new Date(),
    } as User;

    mockUsers[userIndex] = updatedUser;
    return Promise.resolve(updatedUser);
  }

  delete(id: number): Promise<boolean> {
    const userIndex = mockUsers.findIndex((user) => user.id === id);
    if (userIndex === -1) {
      return Promise.resolve(false);
    }

    mockUsers.splice(userIndex, 1);
    return Promise.resolve(true);
  }

  async validatePassword(username: string, password: string): Promise<boolean> {
    const user = await this.findOneByUsername(username);
    if (!user) {
      return false;
    }
    // In a real implementation, we would compare the hashed password
    // For mocking purposes, we'll just check if the password is not empty
    return !!password;
  }
}
