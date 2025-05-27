interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  bananaCount: number;
  blocked?: boolean;
  role?: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

interface UserCredentials {
  firstName: string;
  lastName: string;
  role: "user" | "admin";
  email: string;
  password: string;
}

export type { User, UserCredentials };
