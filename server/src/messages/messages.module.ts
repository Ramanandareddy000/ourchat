import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message, Conversation, ConversationParticipant } from '../models';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { ChatController } from './chat.controller';
import { ChatParticipantsController } from './chat-participants.controller';
import { MessageNotFoundExceptionFilter } from './exceptions/message-not-found.filter';
import { WebSocketModule } from '../websocket/websocket.module';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Message,
      Conversation,
      ConversationParticipant,
    ]),
    forwardRef(() => WebSocketModule),
  ],
  providers: [
    MessagesService,
    {
      provide: 'APP_FILTER',
      useClass: MessageNotFoundExceptionFilter,
    },
  ],
  controllers: [MessagesController, ChatController, ChatParticipantsController],
  exports: [MessagesService],
})
export class MessagesModule {}
