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
  Inject,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AddParticipantDto } from './dto/add-participant.dto';
import { ChatWebSocketGateway } from '../websocket/websocket.gateway';

@Controller('chat-participants')
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
export class ChatParticipantsController {
  private readonly logger = new Logger(ChatParticipantsController.name);

  constructor(
    private readonly messagesService: MessagesService,
    private readonly webSocketGateway: ChatWebSocketGateway,
  ) {}

  @Post('add')
  @HttpCode(HttpStatus.CREATED)
  async addParticipant(@Body() body: AddParticipantDto): Promise<
    | {
        success: true;
        message: string;
        participant: {
          id: number;
          chat_id: number;
          user_id: number;
          role: string;
          created_at: Date;
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

      // Validate that chat_id exists in the chats table
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

      // Broadcast the participant added event via WebSocket
      try {
        await this.webSocketGateway.emitParticipantAdded(conversationId, participant);
        this.logger.log(`WebSocket event emitted for participant added to conversation ${conversationId}`);
      } catch (wsError) {
        this.logger.warn(`Failed to emit WebSocket event: ${wsError}`);
        // Don't fail the request if WebSocket fails
      }

      return {
        success: true,
        message: 'Participant added to chat successfully',
        participant: {
          id: participant.id,
          chat_id: participant.conversation_id,
          user_id: participant.user_id,
          role: participant.role,
          created_at: participant.joined_at,
        },
      };
    } catch (error) {
      this.logger.error('Error in addParticipant:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while adding the participant',
      );
    }
  }
}