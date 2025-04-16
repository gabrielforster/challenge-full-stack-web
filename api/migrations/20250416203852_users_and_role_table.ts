import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE TABLE roles (
      identifier TEXT PRIMARY KEY,
      description TEXT NOT NULL
    );

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE user_roles (
      user_id INTEGER REFERENCES users(id),
      role_identifier TEXT REFERENCES roles(identifier),
      PRIMARY KEY (user_id, role_identifier)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS roles;
    DROP TABLE IF EXISTS user_roles;
  `);
}
