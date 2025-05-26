"use client"
import React from 'react';
import Header from '@/components/Header';
import { useInitializeAuth } from '@/store/hooks';
import Link from 'next/link';

export default function Home() {
    useInitializeAuth();

    return (
        <main className="flex flex-col min-h-screen">
            <Header />

            <div className="flex flex-col items-center justify-center p-40">
                <h1 className="text-4xl font-bold">Welcome to Your App</h1>
                <p className="mt-4 text-lg">Get started by editing the code!</p>
                <p>find me at 
                    <Link href="https://github.com/arpittyagi102" target='_blank'> 🐙</Link>,
                    <Link href="https://www.linkedin.com/in/arpittyagi102" target='_blank'>🩵</Link> or
                    <Link href="https://arpittyagi.in" target='_blank'> 🌐</Link>
                </p>
            </div>
        </main>
    );
}
