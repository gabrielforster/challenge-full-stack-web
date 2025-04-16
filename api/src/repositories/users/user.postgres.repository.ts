import { Knex } from "knex";
import { User, UserRole } from "../../entities/user";
import { hashPassword } from "../../lib/utils/password";
import { UserRepository } from "./interface";

type DBUser = {
  id: number;
  name: string;
  username: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}
type DbRoles = {
  identifier: number;
  description: string;
}
export class PostgresUsersRepository implements UserRepository {
  constructor(private conn: Knex) { }

  fromEntityToDb(user: Omit<User, "roles">): Omit<DBUser, "roles" | "password_hash" | "created_at" | "updated_at"> {
    return {
      id: Number(user.id),
      name: user.name,
      username: user.username,
      email: user.email,
    }
  }

  fromDbToEntity(dbUser: DBUser, roles: DbRoles[] = []): Omit<User, "password"> {
    return {
      id: dbUser.id.toString(),
      name: dbUser.name,
      username: dbUser.username,
      email: dbUser.email,
      roles: roles.map(role => role.description),
      createdAt: new Date(dbUser.created_at),
      updatedAt: new Date(dbUser.updated_at),
    }
  }

  findByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  findById(id: number): Promise<User | null> {
    throw new Error("Method not implemented.");
  }

  listAll(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }

  async create(user: User): Promise<Omit<User, "password">> {
    const hashedPassword = hashPassword(user.username, user.password);

    const trx = await this.conn.transaction();

    const [createdUser] = await trx("users")
      .insert({
        username: user.username,
        full_name: user.name,
        email: user.email,
        password_hash: hashedPassword,
      })
      .returning("*") as DBUser[];

    const dbRoles = await trx("roles").whereIn("identifier", user.roles);
    const userId = createdUser.id;

    const userRoles = dbRoles.map(role => ({
      user_id: userId,
      role_identifier: role.identifier,
    }));

    await trx("user_roles").insert(userRoles);
    await trx.commit();

    const domainNewUser = this.fromDbToEntity(createdUser, dbRoles);

    return domainNewUser
  }

  update(user: User): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async listRolesFromUser(user: User): Promise<UserRole[]> {
    const dbUser = await this.conn("users")
      .where("id", user.id)
      .select("*")
      .first<DBUser | undefined>();

    if (dbUser === undefined)
      return [];

    const roles = await this.conn("user_roles")
      .where("user_id", dbUser.id)
      .join("roles", "user_roles.role_identifier", "=", "roles.identifier")
      .select("roles.*");

    return roles
  }

  async listAllRoles(): Promise<UserRole[]> {
    const dbRoles = await this.conn("roles").select("*");
    return dbRoles;
  }

  delete(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
