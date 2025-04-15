import { Student } from "../../entities/student";

export interface StudentRepository {
  findByEmail(email: string): Promise<Student | null>;
  findByRa(ra: string): Promise<Student | null>;
  listAll(): Promise<Student[]>;
  create(student: Omit<Student, "ra">): Promise<Student>;
  update(student: Student): Promise<Student>;
  delete(ra: string): Promise<void>;
}
