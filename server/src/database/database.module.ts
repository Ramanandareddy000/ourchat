import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  User,
  Message,
  Conversation,
  ConversationParticipant,
  MessageStatus,
} from '../models';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        // Extract configuration values with proper typing
        const host: string = configService.get<string>('DB_HOST', 'localhost');
        const port: number = configService.get<number>('DB_PORT', 5432);
        const username: string = configService.get<string>(
          'DB_USERNAME',
          'postgres',
        );
        const password: string = configService.get<string>(
          'DB_PASSWORD',
          'postgres',
        );
        const database: string = configService.get<string>(
          'DB_NAME',
          'ourschat',
        );
        const synchronize: boolean = configService.get<boolean>(
          'DB_SYNC',
          false,
        );

        console.log('Database configuration:', {
          dialect: 'postgres',
          host,
          port,
          username,
          password,
          database,
        });

        return {
          dialect: 'postgres' as Dialect,
          host,
          port,
          username,
          password,
          database,
          autoLoadModels: true,
          synchronize,
          models: [
            User,
            Message,
            Conversation,
            ConversationParticipant,
            MessageStatus,
          ],
          logging: console.log, // Enable logging for debugging
          retryAttempts: 3,
          retryDelay: 1000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  exports: [SequelizeModule],
})
export class DatabaseModule {}
