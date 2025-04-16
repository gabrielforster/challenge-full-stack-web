import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.raw(`
    CREATE SEQUENCE students_ra_seq START WITH 1000;

    CREATE TABLE IF NOT EXISTS students (
      ra INTEGER PRIMARY KEY DEFAULT nextval('students_ra_seq'),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password TEXT NOT NULL,
      cpf CHAR(11) NOT NULL,
      phone VARCHAR(15),

      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      deleted_at TIMESTAMP WITH TIME ZONE,

      CONSTRAINT students_email_unique UNIQUE(email),
      CONSTRAINT students_cpf_unique UNIQUE(cpf)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw(`
    DROP TABLE students;
    DROP SEQUENCE IF EXISTS students_ra_seq;
  `);
}

