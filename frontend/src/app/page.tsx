import React from 'react';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
        <Header />
        
        <div className="flex flex-col items-center justify-center p-40">
            <h1 className="text-4xl font-bold">Welcome to Your App</h1>
            <p className="mt-4 text-lg">Get started by editing the code!</p>
        </div>
    </main>
  );
}
