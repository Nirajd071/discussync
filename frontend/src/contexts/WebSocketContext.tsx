import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/use-toast';

interface WebSocketContextType {
  connected: boolean;
  sendMessage: (message: any) => void;
  lastMessage: any;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const { user, token } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const connectWebSocket = useCallback(() => {
    if (!user || !token) {
      console.log('WebSocket not connecting - no user or token');
      return;
    }

    console.log('Attempting to connect WebSocket...');
    const wsUrl = `ws://localhost:8004/ws?token=${token}`;
    const newSocket = new WebSocket(wsUrl);

    newSocket.onopen = () => {
      console.log('WebSocket connected successfully');
      setConnected(true);
      setReconnectAttempts(0);
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        setLastMessage(data);

        // Handle different message types
        if (data.type === 'notification') {
          toast({
            title: data.title || 'New Notification',
            description: data.message,
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    newSocket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      setConnected(false);
      setSocket(null);

      // Attempt to reconnect if not a clean close and we haven't exceeded max attempts
      if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
        const nextAttempt = reconnectAttempts + 1;
        setReconnectAttempts(nextAttempt);

        // Exponential backoff for reconnect
        const timeout = Math.min(1000 * Math.pow(2, nextAttempt), 30000);
        setTimeout(connectWebSocket, timeout);
      }
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Don't attempt to reconnect on error - let the onclose handler do that
    };

    setSocket(newSocket);

    // Cleanup function
    return () => {
      if (newSocket && newSocket.readyState === WebSocket.OPEN) {
        console.log('Closing WebSocket connection');
        newSocket.close();
      }
    };
  }, [user, token, reconnectAttempts]);

  useEffect(() => {
    const cleanup = connectWebSocket();

    return () => {
      if (cleanup) cleanup();
    };
  }, [connectWebSocket]);

  // Ping to keep connection alive
  useEffect(() => {
    if (!connected) return;

    const interval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send ping every 30 seconds

    return () => clearInterval(interval);
  }, [socket, connected]);

  const sendMessage = useCallback((message: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, [socket]);

  const value = {
    connected,
    sendMessage,
    lastMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};
