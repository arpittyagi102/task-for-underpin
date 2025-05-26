"use client";

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { getAllUsers, deleteUser, toggleBlockUser } from '@/services/user';
import { showToast } from '@/utils/toast';
import Link from 'next/link';

type SortField = 'firstName' | 'email' | 'bananaCount';
type SortOrder = 'asc' | 'desc';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('firstName');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

    const fetchUsers = async () => {
        setLoading(true);
        const response = await getAllUsers();
        if (response.success && response.users) {
            setUsers(response.users);
        } else {
            showToast(response.message || 'Failed to fetch users', 'error');
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        const response = await deleteUser(userId);
        if (response.success) {
            showToast('User deleted successfully', 'success');
            fetchUsers();
        } else {
            showToast(response.message || 'Failed to delete user', 'error');
        }
    };

    const handleBlock = async (userId: string, currentBlocked: boolean) => {
        const response = await toggleBlockUser(userId, !currentBlocked);
        if (response.success && response.user) {
            showToast(`User ${response.user.blocked ? 'blocked' : 'unblocked'} successfully`, 'success');
            setUsers(users.map(user =>
                user._id === userId ? { ...user, blocked: response.user!.blocked } : user
            ));
        } else {
            showToast(response.message || 'Failed to update user status', 'error');
        }
    };

    const filteredUsers = users.filter(user =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
            return sortOrder === 'asc'
                ? aValue.localeCompare(bValue)
                : bValue.localeCompare(aValue);
        }

        return sortOrder === 'asc'
            ? (aValue as number) - (bValue as number)
            : (bValue as number) - (aValue as number);
    });

    const handleSort = (field: SortField) => {
        if (field === sortField) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-300">Users Management</h1>
                <Link
                    href="/auth/register"
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Create New User
                </Link>
            </div>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            ) : (
                <div className="bg-neutral-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-black">
                        <thead className="bg-neutral-700 text-sm text-neutral-200 font-bold">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleSort('firstName')}
                                >
                                    Name {sortField === 'firstName' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleSort('email')}
                                >
                                    Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th
                                    className="px-6 py-3 text-left uppercase tracking-wider cursor-pointer hover:bg-gray-600"
                                    onClick={() => handleSort('bananaCount')}
                                >
                                    Bananas {sortField === 'bananaCount' && (sortOrder === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="px-6 py-3 text-left uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-right uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-neutral-800  divide-y divide-black text-neutral-300">
                            {sortedUsers.map((user) => (
                                <tr key={user._id} className={user.blocked ? 'bg-red-50' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">{user.bananaCount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.blocked
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                            }`}>
                                            {user.blocked ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleBlock(user._id, user.blocked || false)}
                                            className={`mr-2 px-3 py-1 rounded ${user.blocked
                                                ? 'bg-green-500 hover:bg-green-600 text-white'
                                                : 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                                }`}
                                        >
                                            {user.blocked ? 'Unblock' : 'Block'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user._id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
