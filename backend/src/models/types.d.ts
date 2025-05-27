interface UserCredentials {
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    email: string;
    password: string;
}

export type { UserCredentials };