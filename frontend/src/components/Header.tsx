"use client"
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearUser } from '@/store/slices/userSlice';
import { useSocketContext } from '@/contexts/SocketContext';
import Link from 'next/link';

const Header = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
    const { socket } = useSocketContext();

    const handleSignOut = () => {
        localStorage.removeItem('token')
        dispatch(clearUser());
        socket?.disconnect();
        socket?.off();
        router.push('/auth/login');
    };

    return (
        <header className="bg-neutral-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link href='/' className="text-xl font-bold">Banana Clicker</Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {(isAuthenticated && user && user.role == 'admin') && (
                            <Link href="/users" className="text-gray-300 hover:text-white transition-colors">
                                Users
                            </Link>
                        )}

                        {(isAuthenticated && user && user.role == 'user') && (
                            <Link href="/leaderboard" className="text-gray-300 hover:text-white transition-colors">
                                Leaderboard
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {isAuthenticated && user ? (
                            <>
                                <span className="text-gray-300">
                                    Hello {user.firstName} 👋
                                </span>
                                <button
                                    onClick={handleSignOut}
                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </>
                        ) : (
                            <Link
                                href="/auth/signup"
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 