import { Student } from "../../entities/student";
import { StudentRepository } from "../../repositories/students/interface";

export class RegisterStudentUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (student: Omit<Student, "phone" | "password" | "createdAt" | "updatedAt">): Promise<Omit<Student, "password">> {
    const studentExists = await this.stundentRepo.findByEmail(student.email);

    if (studentExists)
      throw new Error("student_already_exists");

    const createdStudent = await this.stundentRepo.create(student);

    return createdStudent;
  }
}
