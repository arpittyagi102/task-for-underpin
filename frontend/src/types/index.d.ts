interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bananaCount: number;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface UserCredentials extends User {
  password: string;
}

export type { User, UserCredentials };
