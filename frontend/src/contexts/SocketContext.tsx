import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';
import { initSocket } from '@/utils/socket';
import { useAppSelector } from '@/store/hooks';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });

// Global socket instance to ensure single instance across page navigations
let globalSocket: Socket | null = null;

export const useSocketContext = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // Initialize socket only if we have a user and no existing socket
        if (isAuthenticated && user && !globalSocket) {
            globalSocket = initSocket(user);
            socketRef.current = globalSocket;

            if (!globalSocket.connected) {
                globalSocket.connect();
            }

            const handleConnect = () => {
                setIsConnected(true);
            };

            const handleDisconnect = () => {
                setIsConnected(false);
            };

            globalSocket.on('connect', handleConnect);
            globalSocket.on('disconnect', handleDisconnect);
            globalSocket.on('connect_error', (error) => {
                console.error('Socket connection error:', error);
                setIsConnected(false);
            });

            // Set initial connection status
            setIsConnected(globalSocket.connected);

            // Cleanup listeners
            return () => {
                if (globalSocket) {
                    globalSocket.off('connect', handleConnect);
                    globalSocket.off('disconnect', handleDisconnect);
                    globalSocket.off('connect_error');
                }
            };
        } else if (isAuthenticated && user && globalSocket) {
            // If we already have a socket, just update the ref
            socketRef.current = globalSocket;
            setIsConnected(globalSocket.connected);
        }

        // Cleanup on logout
        return () => {
            if (!isAuthenticated && globalSocket) {
                globalSocket.disconnect();
                globalSocket = null;
                socketRef.current = null;
                setIsConnected(false);
            }
        };
    }, [isAuthenticated, user]);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
}