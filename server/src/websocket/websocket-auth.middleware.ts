import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { User } from '../models';

interface AuthenticatedSocket extends Socket {
  userId?: number;
  username?: string;
}

export const WebSocketAuthMiddleware = (jwtService: JwtService) => {
  return async (socket: AuthenticatedSocket, next: (err?: Error) => void) => {
    try {
      // Get token from query params or auth header
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.query?.token ||
        socket.request.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        return next(new Error('Authentication token not provided'));
      }

      // Verify JWT token
      const decoded = jwtService.verify(token, {
        secret: process.env.JWT_SECRET || 'your-secret-key',
      });

      if (!decoded || !decoded.sub) {
        return next(new Error('Invalid token'));
      }

      // Get user from database
      const user = await User.findByPk(decoded.sub, {
        attributes: ['id', 'username', 'display_name', 'online'],
      });

      if (!user) {
        return next(new Error('User not found'));
      }

      // Attach user info to socket
      socket.userId = user.id;
      socket.username = user.username;

      next();
    } catch (error) {
      console.error('WebSocket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  };
};
