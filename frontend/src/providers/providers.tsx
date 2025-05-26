'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from "@/store/hooks";
import { useSocket } from "@/hooks/useSocket";
import { useInitializeAuth } from "@/store/hooks";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <SocketProvider>
                {children}
            </SocketProvider>
            <Toaster />
        </Provider>
    );
}

function SocketProvider({ children }: { children: React.ReactNode }) {
    useInitializeAuth();
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
    useSocket(user, isAuthenticated);

    return (
        <Provider store={store}>
            {children}
        </Provider>
    );
}