import type { Knex } from "knex"
import { StudentRepository } from "./interface";
import { Student } from "../../entities/student";

type DBStudent = {
  ra: number;
  full_name: string;
  email: string;
  password: string;
  cpf: string;
  phone?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}
export class PostgresStudentRepository implements StudentRepository {
  constructor(private conn: Knex) { }

  private fromDbToEntity(dbStudent: DBStudent): Student {
    return {
      ra: dbStudent.ra.toString(),
      name: dbStudent.full_name,
      email: dbStudent.email,
      password: dbStudent.password,
      cpf: dbStudent.cpf,
      phone: dbStudent.phone,
      createdAt: dbStudent.created_at,
      updatedAt: dbStudent.updated_at,
    }
  }

  private fromEntityToDb(student: Omit<Student, "ra" | "password"> & { ra?: string, password?: string }): Omit<DBStudent, "ra" | "password"> & { ra?: number, password?: string } {
    return {
      ra: student.ra ? parseInt(student.ra) : undefined,
      full_name: student.name,
      email: student.email,
      password: student.password,
      cpf: student.cpf,
      phone: student.phone,
      created_at: student.createdAt,
      updated_at: student.updatedAt,
    }
  }

  async findByEmail(email: string): Promise<Student | null> {
    const userWithEmail = await this.conn("students")
      .where("email", email)
      .select("*")
      .first<DBStudent | undefined>()

    if (userWithEmail === undefined)
      return null

    return this.fromDbToEntity(userWithEmail)
  }

  async findByRa(ra: string): Promise<Student | null> {
    const row = await this.conn("students")
      .where("ra", ra)
      .select("*")
      .first<DBStudent | undefined>()

    if (row === undefined)
      return null

    const item = this.fromDbToEntity(row)
    // @ts-expect-error Deleting student password
    delete item.password

    return item
  }

  async getNextRa(): Promise<string> {
    const { rows } = await this.conn.raw(`
      SELECT nextval('students_ra_seq') as ra
    `)

    const row = rows[0]
    return row.ra
  }

  async listAll(): Promise<Student[]> {
    const dbStudents = await this.conn("students").where({ deleted_at: null }).select("*")
    const domainStudents = dbStudents.map((dbStudent) => this.fromDbToEntity(dbStudent))
    return domainStudents
  }

  async create(student: Omit<Student, "password">): Promise<Omit<Student, "password">> {
    // TODO: handle ra conflict

    const [insertedItem] = await this.conn("students")
      .insert({
        ...this.fromEntityToDb(student),
        password: student.cpf,
      })
      .returning<[DBStudent]>("*")

    return {
      ...student,
      ra: insertedItem.ra.toString(),
    }
  }

  async update(student: Student): Promise<void> {
    await this.conn("students")
      .where("ra", student.ra)
      .update({
        ...this.fromEntityToDb(student),
        updated_at: new Date(),
      })
  }

  async delete(ra: string): Promise<void> {
    await this.conn("students")
      .where("ra", ra)
      .update({
        deleted_at: new Date(),
      })
  }
}
