import { Student } from "../../entities/student";

export interface StudentRepository {
  findByEmail(email: string): Promise<Student | null>;
  findByRa(ra: string): Promise<Student | null>;
  listAll(): Promise<Student[]>;
  getNextRa(): Promise<string>;
  create(student: Omit<Student, "password">): Promise<Omit<Student, "password">>;
  update(student: Student): Promise<void>;
  delete(ra: string): Promise<void>;
}
