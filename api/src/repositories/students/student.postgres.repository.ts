import type { Knex } from "knex"
import { StudentRepository } from "./interface";
import { Student } from "../../entities/student";

type DBStudent = {
  ra: number;
  full_name: string;
  email: string;
  password: string;
  cpf: string;
  birth_date: Date;
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
      birthDate: dbStudent.birth_date,
      createdAt: dbStudent.created_at,
      updatedAt: dbStudent.updated_at,
    }
  }

  private fromEntityToDb(student: Omit<Student, "ra"> & { ra?: string }): Omit<DBStudent, "ra"> & { ra?: number } {
    return {
      ra: student.ra ? parseInt (student.ra) : undefined,
      full_name: student.name,
      email: student.email,
      password: student.password,
      cpf: student.cpf,
      phone: student.phone,
      birth_date: new Date(student.birthDate),
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

  findByRa(ra: string): Promise<Student | null> {
    throw new Error("Method not implemented.");
  }

  async listAll(): Promise<Student[]> {
    const dbStudents = await this.conn("students").select("*")
    const domainStudents = dbStudents.map((dbStudent) => this.fromDbToEntity(dbStudent))
    return domainStudents
  }

  async create(student: Omit<Student, "ra">): Promise<Student> {
    const [insertedItem] = await this.conn("students")
      .insert(this.fromEntityToDb(student))
      .returning<[DBStudent]>("*")

    return {
      ...student,
      ra: insertedItem.ra.toString(),
    }
  }

  update(student: Student): Promise<Student> {
    throw new Error("Method not implemented.");
  }

  delete(ra: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
