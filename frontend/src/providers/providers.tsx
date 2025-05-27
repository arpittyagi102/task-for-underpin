'use client';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { Toaster } from 'react-hot-toast';
import { useInitializeAuth } from "@/store/hooks";
import { SocketProvider } from '@/contexts/SocketContext';

export default function Providers({ children }: { children: React.ReactNode }) {

    return (
        <Provider store={store}>
            <InitializingAuth>
                <SocketProvider>
                    {children}
                </SocketProvider>
            </InitializingAuth>
            <Toaster />
        </Provider>
    );
}

function InitializingAuth({children}: {children: React.ReactNode}) {
    useInitializeAuth();
    return children;
}