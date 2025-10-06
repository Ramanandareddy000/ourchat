import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Logger,
  BadRequestException,
  InternalServerErrorException,
  Headers,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { StartConversationDto } from './dto/start-conversation.dto';

@Controller('chat')
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
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly messagesService: MessagesService) {}

  @Post('participants')
  @HttpCode(HttpStatus.CREATED)
  async addParticipant(@Body() body: AddParticipantDto): Promise<
    | {
        success: true;
        message: string;
        participant: {
          id: number;
          chat_id: number;
          user_id: number;
          added_at: Date;
        };
      }
    | { success: false; error: string }
  > {
    try {
      const conversationId = body.chat_id;
      const userId = body.user_id;
      const username = body.username;

      this.logger.log(
        `Attempting to add participant to conversation ${conversationId}`,
      );

      // TODO: Add proper authentication and authorization
      // For now, we'll skip the permission check to allow testing
      // In production, you should extract the user ID from JWT token and check permissions

      const result = await this.messagesService.addParticipantValidated({
        conversationId,
        userId,
        username,
      });

      if ('error' in result) {
        this.logger.warn(
          `Failed to add participant to conversation ${conversationId}: ${result.error}`,
        );
        return { success: false, error: result.error };
      }

      const participant = result.participant;
      this.logger.log(
        `Successfully added user ${participant.user_id} to conversation ${conversationId}`,
      );

      return {
        success: true,
        message: 'User added to chat successfully',
        participant: {
          id: participant.id,
          chat_id: participant.conversation_id,
          user_id: participant.user_id,
          added_at: participant.joined_at,
        },
      };
    } catch (error) {
      this.logger.error('Error in addParticipant:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while adding the participant',
      );
    }
  }

  @Post('start-conversation')
  @HttpCode(HttpStatus.CREATED)
  async startConversation(@Body() body: StartConversationDto): Promise<
    | {
        success: true;
        message: string;
        conversation: {
          id: number;
          name: string | null;
          is_group: boolean;
          created_by: number | null;
          created_at: Date;
          is_existing: boolean;
        };
      }
    | { success: false; error: string }
  > {
    try {
      const { current_user_id, target_user_id, target_username } = body;

      this.logger.log(
        `Attempting to start conversation between user ${current_user_id} and ${target_user_id || target_username}`,
      );

      const result = await this.messagesService.startConversationWithUser({
        currentUserId: current_user_id,
        targetUserId: target_user_id,
        targetUsername: target_username,
      });

      if ('error' in result) {
        this.logger.warn(`Failed to start conversation: ${result.error}`);
        return { success: false, error: result.error };
      }

      const conversation = result.conversation;

      // Check if this conversation already existed or was newly created
      const isExisting = conversation.created_at < new Date(Date.now() - 1000); // Created more than 1 second ago

      this.logger.log(
        `Successfully ${isExisting ? 'found existing' : 'created new'} conversation ${conversation.id}`,
      );

      return {
        success: true,
        message: isExisting
          ? 'Existing conversation found'
          : 'New conversation created successfully',
        conversation: {
          id: conversation.id,
          name: conversation.name,
          is_group: conversation.is_group,
          created_by: conversation.created_by,
          created_at: conversation.created_at,
          is_existing: isExisting,
        },
      };
    } catch (error) {
      this.logger.error('Error in startConversation:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while starting the conversation',
      );
    }
  }
}
