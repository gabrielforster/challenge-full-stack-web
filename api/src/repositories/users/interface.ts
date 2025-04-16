import { User, UserRole } from "../../entities/user";

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  listAll(): Promise<User[]>;
  create(user: User): Promise<Omit<User, "password">>;
  update(user: User): Promise<void>;
  listRolesFromUser(user: User): Promise<UserRole[]>;
  listAllRoles(): Promise<UserRole[]>;
  delete(id: number): Promise<void>;
}
