import { User } from '../models';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

export interface IUsersService {
  create(user: CreateUserDto): Promise<User>;
  findAll(): Promise<User[]>;
  findOneById(id: number): Promise<User | null>;
  findOneByUsername(username: string): Promise<User | null>;
  update(id: number, updates: UpdateUserDto): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  validatePassword(username: string, password: string): Promise<boolean>;
}
