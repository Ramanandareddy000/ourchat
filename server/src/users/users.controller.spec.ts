import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './users.service';
import { User } from '../models';
import { UserNotFoundException } from './exceptions/user-not-found.exception';

describe('UsersController', () => {
  let controller: UsersController;
  // Remove the unused service variable

  const mockUser: User = {
    id: 1,
    username: 'testuser',
    password_hash: 'hashedpassword',
    display_name: 'Test User',
    avatar_url: null,
    image: null,
    online: false,
    last_seen: null,
    phone: null,
    about: null,
    is_group: false,
    created_at: new Date(),
    updated_at: new Date(),
    toJSON: jest.fn().mockReturnValue({
      id: 1,
      username: 'testuser',
      displayName: 'Test User',
      avatarUrl: null,
      online: false,
      last_seen: null,
      phone: null,
      about: null,
      is_group: false,
      created_at: new Date(),
      updated_at: new Date(),
    }),
  } as any;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findOneByUsername: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    validatePassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    // Remove the unused service assignment
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user when found', async () => {
      mockUserService.findOneById.mockResolvedValue(mockUser);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw UserNotFoundException when user is not found', async () => {
      mockUserService.findOneById.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(
        UserNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should return updated user when found', async () => {
      mockUserService.update.mockResolvedValue(mockUser);

      const result = await controller.update(1, {
        username: 'updateduser',
        displayName: 'Updated User',
      });
      expect(result).toEqual(mockUser);
      expect(mockUserService.update).toHaveBeenCalledWith(1, {
        username: 'updateduser',
        displayName: 'Updated User',
      });
    });

    it('should throw UserNotFoundException when user is not found', async () => {
      mockUserService.update.mockResolvedValue(null);

      await expect(
        controller.update(1, {
          username: 'updateduser',
          displayName: 'Updated User',
        }),
      ).rejects.toThrow(UserNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user when found', async () => {
      mockUserService.delete.mockResolvedValue(true);

      await expect(controller.delete(1)).resolves.not.toThrow();
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw UserNotFoundException when user is not found', async () => {
      mockUserService.delete.mockResolvedValue(false);

      await expect(controller.delete(1)).rejects.toThrow(UserNotFoundException);
    });
  });
});
