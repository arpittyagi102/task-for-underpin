"use client"
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAppSelector } from '@/store/hooks';
import { getSocket } from '@/utils/socket';

export default function Home() {
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const socket = getSocket();
    const socketState = socket ? socket.connected : false;

    return (
        <main className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col items-center justify-center p-40">
                <h1 className="text-4xl font-bold">{isAuthenticated ? "Logged in" : "Not Logged in"}</h1>
                <h1 className="text-4xl font-bold">{socketState ? "Socket connected" : "Socket not connected"}</h1>
                <Link href="/banana" className="text-blue-500 hover:underline">Go to Banana Page</Link>
            </div>
        </main>
    );
}
