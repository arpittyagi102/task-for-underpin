interface User {
  firstName: string;
  lastName: string;
  email: string;
}

interface UserCredentials extends User {
    password: string;
}

export type { User, UserCredentials };