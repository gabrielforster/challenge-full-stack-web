import { Student } from "../../entities/student";
import { StudentRepository } from "./interface";

export class MemoryStudentRepository implements StudentRepository {
  private students: Student[] = [];
  private raCounter: number = 1;

  async findByEmail(email: string): Promise<Student | null> {
    const student = this.students.find((s) => s.email === email);
    return student ? { ...student } : null;
  }

  async findByRa(ra: string): Promise<Student | null> {
    const student = this.students.find((s) => s.ra === ra);
    return student ? { ...student } : null;
  }

  async listAll(): Promise<Student[]> {
    // Return a copy to avoid mutation in tests
    return this.students.map((s) => ({ ...s }));
  }

  async getNextRa(): Promise<string> {
    // Simple incrementing RA, you can adjust the format as needed
    return String(this.raCounter).padStart(6, "0");
  }

  async create(student: Omit<Student, "password">): Promise<Omit<Student, "password">> {
    const ra = await this.getNextRa();
    const newStudent: Student = {
      ...student,
      ra,
      password: student.cpf, // password is omitted, but we need to fill the type
    };
    this.students.push(newStudent);
    this.raCounter++;

    // @ts-expect-error Deleting student password
    delete newStudent.password
    return newStudent;
  }

  async update(student: Student): Promise<void> {
    const idx = this.students.findIndex((s) => s.ra === student.ra);
    if (idx === -1) {
      throw new Error("Student not found");
    }
    this.students[idx] = { ...student };
  }

  async delete(ra: string): Promise<void> {
    this.students = this.students.filter((s) => s.ra !== ra);
  }
}

