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
import { Message } from '../models';
import type { CreateMessageDto } from './dto/create-message.dto';
import type { UpdateMessageDto } from './dto/update-message.dto';
import { MessageNotFoundException } from './exceptions/message-not-found.exception';

@Controller('messages')
@UsePipes(new ValidationPipe({ transform: true }))
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createMessageDto: CreateMessageDto): Promise<Message> {
    return this.messagesService.create(createMessageDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<Message[]> {
    return this.messagesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Message> {
    const message = await this.messagesService.findOneById(id);
    if (!message) {
      throw new MessageNotFoundException(id);
    }
    return message;
  }

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  async findByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Message[]> {
    return this.messagesService.findByUserId(userId);
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
  ): Promise<Message[]> {
    return this.messagesService.findByConversationId(conversationId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateMessageDto: UpdateMessageDto,
  ): Promise<Message> {
    const [count, messages] = await this.messagesService.update(
      id,
      updateMessageDto,
    );
    if (count === 0) {
      throw new MessageNotFoundException(id);
    }
    return messages[0];
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const count = await this.messagesService.delete(id);
    if (count === 0) {
      throw new MessageNotFoundException(id);
    }
  }
}
