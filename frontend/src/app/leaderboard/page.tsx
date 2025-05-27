"use client";

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { getAllUsers } from '@/services/user';
import { showToast } from '@/utils/toast';
import Header from '@/components/Header';
import { useSocketContext } from '@/contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function LeaderboardPage() {
    const { socket } = useSocketContext();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const sortedUsers = [...users].sort((a, b) => b.bananaCount - a.bananaCount );

    const fetchUsers = async () => {
        setLoading(true);
        const response = await getAllUsers();
        if (response.success && response.users) {
            setUsers(response.users.filter(user => !user.blocked));
        }
        setLoading(false);
    };

    const handleBananaUpdate = ({ _id, bananaCount }: { _id: string; bananaCount: number }) => {
        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === _id ? { ...user, bananaCount } : user
            )
        );
    };
    
    const addNewUser = (user: User) => {
        console.log('New user added:', user);
        setUsers(prevUsers => [...prevUsers, user]);
        showToast('New user joined', 'success');
    }

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName[0]}${lastName[0]}`.toUpperCase();
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0: return 'bg-yellow-400/20 border-yellow-400';
            case 1: return 'bg-gray-300/20 border-gray-300';
            case 2: return 'bg-amber-600/20 border-amber-600';
            default: return 'bg-neutral-700/20 border-neutral-600';
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        socket?.on('bananaUpdated', handleBananaUpdate);
        socket?.on('newUser', addNewUser)
        
        return () => {
            socket?.off('bananaUpdated');
        };
    }, [socket]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800">
            <Header />
            <div className="max-w-4xl mt-4 mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-white mb-4">Banana Leaderboard</h1>
                    <p className="text-neutral-400">Real-time rankings of the top banana collectors</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <AnimatePresence>
                            {sortedUsers.map((user, index) => (
                                <motion.div
                                    key={user._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`relative flex items-center p-6 rounded-xl border-2 ${getRankColor(index)} backdrop-blur-sm`}
                                >
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 border-2 border-neutral-600 text-neutral-300 font-bold">
                                        {index + 1}
                                    </div>

                                    <div className="ml-6 flex-shrink-0 w-12 h-12 rounded-full bg-neutral-700 flex items-center justify-center text-xl font-bold text-yellow-400">
                                        {getInitials(user.firstName, user.lastName)}
                                    </div>

                                    <div className="ml-4 flex-grow">
                                        <h3 className="text-lg font-semibold text-white">
                                            {user.firstName} {user.lastName}
                                        </h3>
                                        <p className="text-sm text-neutral-400">{user.email}</p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl">🍌</span>
                                        <span className="text-2xl font-bold text-yellow-400">
                                            {user.bananaCount.toLocaleString()}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}
