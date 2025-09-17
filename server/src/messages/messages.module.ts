import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from '../models';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { MessageNotFoundExceptionFilter } from './exceptions/message-not-found.filter';

@Module({
  imports: [SequelizeModule.forFeature([Message])],
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
