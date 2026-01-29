import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { Message, User } from '../models';
import { MessageNotFoundException } from './exceptions/message-not-found.exception';

describe('MessagesController', () => {
  let controller: MessagesController;
  // Remove the unused service variable

  const mockMessage: Message = {
    id: 1,
    text: 'Hello World',
    time: new Date().toISOString(),
    is_me: true,
    sender_id: 1,
    sender_name: 'Test User',
    receiver_id: 2,
    is_group: false,
    created_at: new Date(),
    updated_at: new Date(),
    // Add the missing sender property
    sender: {} as User,
  } as any;

  const mockMessagesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOneById: jest.fn(),
    findByUserId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    // Add the missing messageModel property
    messageModel: {} as any,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
    // Remove the unused service assignment
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a message when found', async () => {
      mockMessagesService.findOneById.mockResolvedValue(mockMessage);

      const result = await controller.findOne(1);
      expect(result).toEqual(mockMessage);
      expect(mockMessagesService.findOneById).toHaveBeenCalledWith(1);
    });

    it('should throw MessageNotFoundException when message is not found', async () => {
      mockMessagesService.findOneById.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(
        MessageNotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should return updated message when found', async () => {
      mockMessagesService.update.mockResolvedValue([1, [mockMessage]]);

      const result = await controller.update(1, {
        text: 'Updated message',
      });
      expect(result).toEqual(mockMessage);
      expect(mockMessagesService.update).toHaveBeenCalledWith(1, {
        text: 'Updated message',
      });
    });

    it('should throw MessageNotFoundException when message is not found', async () => {
      mockMessagesService.update.mockResolvedValue([0, []]);

      await expect(
        controller.update(1, {
          text: 'Updated message',
        }),
      ).rejects.toThrow(MessageNotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete message when found', async () => {
      mockMessagesService.delete.mockResolvedValue(1);

      await expect(controller.delete(1)).resolves.not.toThrow();
      expect(mockMessagesService.delete).toHaveBeenCalledWith(1);
    });

    it('should throw MessageNotFoundException when message is not found', async () => {
      mockMessagesService.delete.mockResolvedValue(0);

      await expect(controller.delete(1)).rejects.toThrow(
        MessageNotFoundException,
      );
    });
  });
});
