"use client";

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { getAllUsers, deleteUser, toggleBlockUser, createUser, updateUser } from '@/services/user';
import { showToast } from '@/utils/toast';
import Header from '@/components/Header';
import { useSocketContext } from '@/contexts/SocketContext';

type SortField = 'firstName' | 'email' | 'bananaCount';
type SortOrder = 'asc' | 'desc';

interface UserFormData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role?: string;
}

export default function UsersPage() {
    const { socket } = useSocketContext();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortField, setSortField] = useState<SortField>('firstName');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [formData, setFormData] = useState<UserFormData>({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user'
    });

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

    const handleBananaUpdate = ({ _id, bananaCount }: { _id: string; bananaCount: number }) => {
        console.log(`Banana count updated for user ${_id}: ${bananaCount}`);
        setUsers(users => users.map(user =>
            user._id === _id ? { ...user, bananaCount } : user
        ));
    }

    const addNewUser = (user: User) => {
        console.log('New user added:', user);
        setUsers(prevUsers => [...prevUsers, user]);
        showToast('New user joined', 'success');
    }

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

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const response = await createUser(formData);
        if (response.success && response.user) {
            showToast('User created successfully', 'success');
            setShowCreateModal(false);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } else {
            showToast(response.message || 'Failed to create user', 'error');
        }
    };

    const handleEditUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        const response = await updateUser(selectedUser._id, formData);
        if (response.success && response.user) {
            showToast('User updated successfully', 'success');
            setShowEditModal(false);
            setSelectedUser(null);
            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } else {
            showToast(response.message || 'Failed to update user', 'error');
        }
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: '', // Don't pre-fill password
            role: user.role || 'user'
        });
        setShowEditModal(true);
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-300">Users Management</h1>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Create New User
                    </button>
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
                                                onClick={() => openEditModal(user)}
                                                className="mr-2 px-3 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white"
                                            >
                                                Edit
                                            </button>
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

                {/* Create User Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-300 mb-4">Create New User</h2>
                            <form onSubmit={handleCreateUser}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
                                        }}
                                        className="px-4 py-2 text-gray-300 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Create User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit User Modal */}
                {showEditModal && selectedUser && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-neutral-800 p-6 rounded-lg w-full max-w-md">
                            <h2 className="text-xl font-bold text-gray-300 mb-4">Edit User</h2>
                            <form onSubmit={handleEditUser}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">New Password (leave blank to keep current)</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300">Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="mt-1 block w-full px-3 py-2 bg-neutral-700 border border-gray-600 rounded-md text-white"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setSelectedUser(null);
                                            setFormData({ firstName: '', lastName: '', email: '', password: '', role: 'user' });
                                        }}
                                        className="px-4 py-2 text-gray-300 hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Update User
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
