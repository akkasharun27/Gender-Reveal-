import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useRevealSync(onRevealUpdated: () => void) {
  useEffect(() => {
    // Connect to Socket.io server
    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('Socket.io connected:', socket?.id);
      });

      socket.on('disconnect', () => {
        console.log('Socket.io disconnected');
      });

      socket.on('reveal_updated', (data) => {
        console.log('Reveal updated from server:', data);
        // Reload page when reveal status changes
        window.location.reload();
      });

      socket.on('connect_error', (error) => {
        console.error('Socket.io connection error:', error);
      });
    }

    return () => {
      // Keep connection alive, don't disconnect on unmount
    };
  }, []);

  const emitRevealUpdate = useCallback((data: { dadRevealed: boolean; momRevealed: boolean }) => {
    if (socket?.connected) {
      socket.emit('reveal_updated', data);
    }
  }, []);

  return { emitRevealUpdate };
}
