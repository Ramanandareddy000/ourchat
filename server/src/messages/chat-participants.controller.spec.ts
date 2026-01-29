import { Test, TestingModule } from '@nestjs/testing';
import { ChatParticipantsController } from './chat-participants.controller';
import { MessagesService } from './messages.service';
import { ChatWebSocketGateway } from '../websocket/websocket.gateway';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConversationParticipant } from '../models/conversation-participant.model';

describe('ChatParticipantsController', () => {
  let controller: ChatParticipantsController;
  let messagesService: jest.Mocked<MessagesService>;
  let webSocketGateway: jest.Mocked<ChatWebSocketGateway>;

  const mockParticipant: ConversationParticipant = {
    id: 1,
    conversation_id: 117,
    user_id: 42,
    role: 'member',
    joined_at: new Date(),
    updated_at: new Date(),
  } as ConversationParticipant;

  beforeEach(async () => {
    const mockMessagesService = {
      addParticipantValidated: jest.fn(),
    };

    const mockWebSocketGateway = {
      emitParticipantAdded: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatParticipantsController],
      providers: [
        {
          provide: MessagesService,
          useValue: mockMessagesService,
        },
        {
          provide: ChatWebSocketGateway,
          useValue: mockWebSocketGateway,
        },
      ],
    }).compile();

    controller = module.get<ChatParticipantsController>(ChatParticipantsController);
    messagesService = module.get(MessagesService);
    webSocketGateway = module.get(ChatWebSocketGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('addParticipant', () => {
    const validDto = {
      chat_id: 117,
      user_id: 42,
    };

    it('should successfully add a participant with user_id', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        participant: mockParticipant,
      });
      webSocketGateway.emitParticipantAdded.mockResolvedValue(undefined);

      const result = await controller.addParticipant(validDto);

      expect(result).toEqual({
        success: true,
        message: 'Participant added to chat successfully',
        participant: {
          id: mockParticipant.id,
          chat_id: mockParticipant.conversation_id,
          user_id: mockParticipant.user_id,
          role: mockParticipant.role,
          created_at: mockParticipant.joined_at,
        },
      });

      expect(messagesService.addParticipantValidated).toHaveBeenCalledWith({
        conversationId: validDto.chat_id,
        userId: validDto.user_id,
        username: undefined,
      });

      expect(webSocketGateway.emitParticipantAdded).toHaveBeenCalledWith(
        validDto.chat_id,
        mockParticipant,
      );
    });

    it('should successfully add a participant with username', async () => {
      const dtoWithUsername = {
        chat_id: 117,
        username: 'testuser',
      };

      messagesService.addParticipantValidated.mockResolvedValue({
        participant: mockParticipant,
      });
      webSocketGateway.emitParticipantAdded.mockResolvedValue(undefined);

      const result = await controller.addParticipant(dtoWithUsername);

      expect(result.success).toBe(true);
      expect(messagesService.addParticipantValidated).toHaveBeenCalledWith({
        conversationId: dtoWithUsername.chat_id,
        userId: undefined,
        username: dtoWithUsername.username,
      });
    });

    it('should return error when chat does not exist', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        error: 'Chat does not exist.',
      });

      const result = await controller.addParticipant(validDto);

      expect(result).toEqual({
        success: false,
        error: 'Chat does not exist.',
      });

      expect(webSocketGateway.emitParticipantAdded).not.toHaveBeenCalled();
    });

    it('should return error when user does not exist', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        error: 'User with provided ID does not exist.',
      });

      const result = await controller.addParticipant(validDto);

      expect(result).toEqual({
        success: false,
        error: 'User with provided ID does not exist.',
      });

      expect(webSocketGateway.emitParticipantAdded).not.toHaveBeenCalled();
    });

    it('should return error when user is already a participant', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        error: "User 'Test User' is already a participant in this chat.",
      });

      const result = await controller.addParticipant(validDto);

      expect(result).toEqual({
        success: false,
        error: "User 'Test User' is already a participant in this chat.",
      });

      expect(webSocketGateway.emitParticipantAdded).not.toHaveBeenCalled();
    });

    it('should handle WebSocket emission failure gracefully', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        participant: mockParticipant,
      });
      webSocketGateway.emitParticipantAdded.mockRejectedValue(
        new Error('WebSocket error'),
      );

      const result = await controller.addParticipant(validDto);

      // Should still return success even if WebSocket fails
      expect(result.success).toBe(true);
      expect(result.participant).toBeDefined();
    });

    it('should throw InternalServerErrorException on unexpected errors', async () => {
      messagesService.addParticipantValidated.mockRejectedValue(
        new Error('Database connection failed'),
      );

      await expect(controller.addParticipant(validDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });

    it('should validate that chat_id exists in conversations table', async () => {
      const invalidChatDto = {
        chat_id: 999999,
        user_id: 42,
      };

      messagesService.addParticipantValidated.mockResolvedValue({
        error: 'Chat does not exist.',
      });

      const result = await controller.addParticipant(invalidChatDto);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Chat does not exist.');
    });

    it('should prevent duplicate participants', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        error: "User 'Test User' is already a participant in this chat.",
      });

      const result = await controller.addParticipant(validDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('already a participant');
    });

    it('should handle group chat participant limit', async () => {
      messagesService.addParticipantValidated.mockResolvedValue({
        error: 'This group chat has reached the maximum limit of 100 participants.',
      });

      const result = await controller.addParticipant(validDto);

      expect(result.success).toBe(false);
      expect(result.error).toContain('maximum limit');
    });
  });
});