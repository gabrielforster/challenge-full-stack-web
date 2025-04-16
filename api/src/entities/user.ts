export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = {
  identifier: string;
  description: string;
}
