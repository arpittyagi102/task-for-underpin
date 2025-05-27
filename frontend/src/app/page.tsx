"use client"
import React from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { useAppSelector } from '@/store/hooks';
import { useSocketContext } from '@/contexts/SocketContext';

export default function Home() {

    return (
        <main className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col items-center justify-center p-40">
                <UserStatus />
            </div>
        </main>
    );
}

function UserStatus() {
    const { isAuthenticated } = useAppSelector((state) => state.user);
    const { isConnected } = useSocketContext();

    if(!isAuthenticated) {
        return (<h1 className='text-3xl px-8 py-3 rounded-xl bg-neutral-900'>Please <Link href="/auth/signup" className="text-blue-500">Sign Up</Link> to get started</h1>);
    }

    if(!isConnected) {
        return (<h1 className='text-3xl px-8 py-3 rounded-xl bg-neutral-900'>You are not connected to server ⚠️⚠️</h1>);
    }

    return (
        <div>
            <Link href="/banana"><h1 className='text-3xl px-8 py-3 rounded-xl bg-neutral-900'>Lets go to Banana 🍌 Page</h1></Link>
        </div>
    );
}