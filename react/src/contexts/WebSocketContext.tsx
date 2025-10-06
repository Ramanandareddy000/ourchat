import React, { createContext, useContext, useEffect, useRef, ReactNode } from 'react';
import { websocketService, WebSocketService } from '../services/websocketService';
import { useAuth } from '../modules/auth';

interface WebSocketContextType {
  websocket: WebSocketService;
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { token, user, isAuthenticated } = useAuth();
  const [isConnected, setIsConnected] = React.useState(false);
  const connectionAttempted = useRef(false);

  const connect = React.useCallback(async (): Promise<void> => {
    if (!token || !user || !isAuthenticated || connectionAttempted.current) {
      return;
    }

    connectionAttempted.current = true;

    try {
      await websocketService.connect(token, user.id);
      setIsConnected(true);
      console.log('WebSocket connected successfully');
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      connectionAttempted.current = false;
    }
  }, [token, user, isAuthenticated]);

  const disconnect = React.useCallback((): void => {
    websocketService.disconnect();
    setIsConnected(false);
    connectionAttempted.current = false;
    console.log('WebSocket disconnected');
  }, []);

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated && token && user && !connectionAttempted.current) {
      connect();
    }
  }, [isAuthenticated, token, user, connect]);

  // Auto-disconnect when not authenticated
  useEffect(() => {
    if (!isAuthenticated && isConnected) {
      disconnect();
    }
  }, [isAuthenticated, isConnected, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect();
      }
    };
  }, [isConnected, disconnect]);

  const contextValue: WebSocketContextType = {
    websocket: websocketService,
    isConnected,
    connect,
    disconnect,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};