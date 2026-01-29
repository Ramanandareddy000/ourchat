import {
  WebSocketGateway as WSGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MessagesService } from '../messages/messages.service';
import { UserService } from '../users/users.service';
import { WebSocketAuthMiddleware } from './websocket-auth.middleware';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  username?: string;
}

interface JoinConversationData {
  conversation_id: number;
}

interface SendMessageData {
  conversation_id: number;
  content: string;
  receiver_id?: number;
}

interface TypingData {
  conversation_id: number;
  is_typing: boolean;
}

interface MessageReadData {
  message_id: number;
  conversation_id: number;
}

@WSGateway({
  cors: {
    origin: [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173',
      'http://127.0.0.1:5173',
    ],
    credentials: true,
  },
})
@Injectable()
export class ChatWebSocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatWebSocketGateway');
  private connectedUsers: Map<number, string> = new Map(); // userId -> socketId

  constructor(
    private messagesService: MessagesService,
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');

    // Apply authentication middleware
    server.use(WebSocketAuthMiddleware(this.jwtService));
  }

  async handleConnection(client: AuthenticatedSocket) {
    this.logger.log(`Client connecting: ${client.id}`);

    try {
      // If authentication was successful, userId should be set by middleware
      if (client.userId) {
        this.connectedUsers.set(client.userId, client.id);

        // Update user online status
        await this.usersService.updateOnlineStatus(client.userId, true);

        // Broadcast user online status to relevant conversations
        await this.broadcastUserStatus(client.userId, true);

        this.logger.log(`User ${client.userId} (${client.username}) connected`);
      } else {
        this.logger.warn('Client connected without proper authentication');
        client.disconnect();
        return;
      }
    } catch (error) {
      this.logger.error('Error handling connection:', error);
      client.disconnect();
    }
  }

  async handleDisconnect(client: AuthenticatedSocket) {
    this.logger.log(`Client disconnecting: ${client.id}`);

    if (client.userId) {
      this.connectedUsers.delete(client.userId);

      try {
        // Update user offline status
        await this.usersService.updateOnlineStatus(client.userId, false);

        // Broadcast user offline status to relevant conversations
        await this.broadcastUserStatus(client.userId, false);

        this.logger.log(
          `User ${client.userId} (${client.username}) disconnected`,
        );
      } catch (error) {
        this.logger.error('Error handling disconnection:', error);
      }
    }
  }

  @SubscribeMessage('join_conversation')
  async handleJoinConversation(
    @MessageBody() data: JoinConversationData,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { conversation_id } = data;

      if (!client.userId || !conversation_id) {
        client.emit('error', { message: 'Invalid data provided' });
        return;
      }

      // Verify user is a participant in the conversation
      const participants =
        await this.messagesService.getConversationParticipants(conversation_id);
      const isParticipant = participants.some(
        (p) => p.user_id === client.userId,
      );

      if (!isParticipant) {
        client.emit('error', {
          message: 'Not authorized to join this conversation',
        });
        return;
      }

      // Join the conversation room
      const roomName = `conversation_${conversation_id}`;
      await client.join(roomName);

      this.logger.log(
        `User ${client.userId} joined conversation ${conversation_id}`,
      );
      client.emit('joined_conversation', { conversation_id });
    } catch (error) {
      this.logger.error('Error joining conversation:', error);
      client.emit('error', { message: 'Failed to join conversation' });
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: SendMessageData,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { conversation_id, content, receiver_id } = data;

      if (!client.userId || !content?.trim()) {
        client.emit('error', { message: 'Invalid message data' });
        return;
      }

      // Send message using existing service
      const result = await this.messagesService.sendDirectOrGroupMessage({
        senderId: client.userId,
        content: content.trim(),
        conversationId: conversation_id,
        receiverId: receiver_id,
      });

      if ('error' in result) {
        client.emit('error', { message: result.error });
        return;
      }

      const message = result.message;
      const roomName = `conversation_${message.conversation_id}`;

      // Emit the new message to all participants in the conversation
      this.server.to(roomName).emit('message:new', {
        id: message.id,
        conversation_id: message.conversation_id,
        sender_id: message.sender_id,
        sender_username: client.username,
        text: message.text,
        created_at: message.created_at,
        timestamp: new Date(message.created_at).toISOString(),
      });

      // Confirm message sent to sender
      client.emit('message:sent', {
        id: message.id,
        conversation_id: message.conversation_id,
        timestamp: new Date(message.created_at).toISOString(),
      });
    } catch (error) {
      this.logger.error('Error sending message:', error);
      client.emit('error', { message: 'Failed to send message' });
    }
  }

  @SubscribeMessage('typing')
  async handleTyping(
    @MessageBody() data: TypingData,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { conversation_id, is_typing } = data;

      if (!client.userId || !conversation_id) {
        return;
      }

      const roomName = `conversation_${conversation_id}`;

      // Broadcast typing status to other participants (not sender)
      client.to(roomName).emit('user:typing', {
        user_id: client.userId,
        username: client.username,
        conversation_id,
        is_typing,
      });
    } catch (error) {
      this.logger.error('Error handling typing:', error);
    }
  }

  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @MessageBody() data: MessageReadData,
    @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    try {
      const { message_id, conversation_id } = data;

      if (!client.userId || !message_id) {
        client.emit('error', { message: 'Invalid data provided' });
        return;
      }

      // Here you would update the message_status table
      // For now, just broadcast the read status
      const roomName = `conversation_${conversation_id}`;

      client.to(roomName).emit('message:read', {
        message_id,
        conversation_id,
        user_id: client.userId,
        username: client.username,
        read_at: new Date().toISOString(),
      });
    } catch (error) {
      this.logger.error('Error marking message as read:', error);
    }
  }

  private async broadcastUserStatus(userId: number, isOnline: boolean) {
    try {
      // Get all conversations this user is part of
      const conversations =
        await this.messagesService.getConversationsForUser(userId);

      // Broadcast status to each conversation room
      for (const conversation of conversations) {
        const roomName = `conversation_${conversation.id}`;
        this.server.to(roomName).emit('user:status', {
          user_id: userId,
          is_online: isOnline,
          last_seen: isOnline ? null : new Date().toISOString(),
        });
      }
    } catch (error) {
      this.logger.error('Error broadcasting user status:', error);
    }
  }

  // Method to emit participant added event
  async emitParticipantAdded(conversationId: number, newParticipant: any) {
    const roomName = `conversation_${conversationId}`;
    this.server.to(roomName).emit('participant:added', {
      conversation_id: conversationId,
      participant: {
        id: newParticipant.id,
        user_id: newParticipant.user_id,
        username: newParticipant.user?.username,
        display_name: newParticipant.user?.display_name,
        role: newParticipant.role,
        joined_at: newParticipant.joined_at,
      },
    });
  }
}
