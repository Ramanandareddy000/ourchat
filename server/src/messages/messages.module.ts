import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message, Conversation, ConversationParticipant } from '../models';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageNotFoundExceptionFilter } from './exceptions/message-not-found.filter';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      Conversation,
      ConversationParticipant,
    ]),
  ],
  providers: [
    MessagesService,
    {
      provide: 'APP_FILTER',
      useClass: MessageNotFoundExceptionFilter,
    },
  ],
  controllers: [MessagesController],
  exports: [MessagesService],
})
export class MessagesModule {}
