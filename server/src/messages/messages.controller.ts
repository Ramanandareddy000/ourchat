import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { Message, User } from '../models';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { UpdateMessageDto } from './dto/update-message.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { MessageNotFoundException } from './exceptions/message-not-found.exception';

@Controller('messages')
@UsePipes(new ValidationPipe({ transform: true }))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMessageDto: CreateMessageDto): Promise<any> {
    const created = await this.messagesService.create(createMessageDto);
    return { data: created, success: true };
  }

  @Post('send')
  @HttpCode(HttpStatus.CREATED)
  async send(@Body() body: SendMessageDto): Promise<
    | {
        success: true;
        message: {
          message_id: number;
          sender_id: number;
          receiver_id?: number;
          content: string;
          timestamp: string;
          conversation_id: number;
        };
      }
    | { success: false; error: string }
  > {
    try {
      const result = await this.messagesService.sendDirectOrGroupMessage({
        senderId: body.sender_id,
        content: body.content,
        receiverId: body.receiver_id,
        conversationId: body.conversation_id,
      });

      if ('error' in result) {
        return { success: false, error: result.error };
      }

      const created = result.message;
      return {
        success: true,
        message: {
          message_id: created.id,
          sender_id: created.sender_id,
          receiver_id: body.receiver_id,
          content: created.text,
          timestamp: (created.created_at instanceof Date
            ? created.created_at
            : new Date(created.created_at as unknown as string)
          ).toISOString(),
          conversation_id: created.conversation_id,
        },
      };
    } catch (error) {
      console.error('Error in send message controller:', error);
      return {
        success: false,
        error: 'An unexpected error occurred while sending the message.',
      };
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<any> {
    const messages = await this.messagesService.findAll();
    return { data: messages, success: true };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const message = await this.messagesService.findOneById(id);
    if (!message) {
      throw new MessageNotFoundException(id);
    }
    return { data: message, success: true };
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any> {
    const messages = await this.messagesService.findByUserId(userId);
    const enriched = messages.map((m: Message & { sender?: User }) => ({
      id: m.id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      text: m.text,
      created_at: m.created_at,
      sender_username: m.sender?.username,
      sender_avatar: m.sender?.avatar_url || null,
    }));
    return { data: enriched, success: true };
  }

  @Get('user/:userId/conversations')
  @HttpCode(HttpStatus.OK)
  async getConversationsForUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<any[]> {
    return this.messagesService.getConversationsForUser(userId);
  }

  @Get('conversation/:conversationId')
  @HttpCode(HttpStatus.OK)
  async findByConversationId(
    @Param('conversationId', ParseIntPipe) conversationId: number,
  ): Promise<any> {
    const messages =
      await this.messagesService.findByConversationId(conversationId);
    const enriched = messages.map((m: Message & { sender?: User }) => ({
      id: m.id,
      conversation_id: m.conversation_id,
      sender_id: m.sender_id,
      text: m.text,
      created_at: m.created_at,
      sender_username: m.sender?.username,
      sender_avatar: m.sender?.avatar_url || null,
    }));
    return { data: enriched, success: true };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<any> {
    const [count, messages] = await this.messagesService.update(
      id,
      updateMessageDto,
    );
    if (count === 0) {
      throw new MessageNotFoundException(id);
    }
    return { data: messages[0], success: true };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<any> {
    const count = await this.messagesService.delete(id);
    if (count === 0) {
      throw new MessageNotFoundException(id);
    }
    return { data: null, success: true };
  }

  // participant endpoint moved to ChatController
}
