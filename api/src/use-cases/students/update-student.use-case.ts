import { StudentRepository } from "../../repositories/students/interface";

export class UpdateStundentUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (ra: string, student: { name?: string, email?: string }): Promise<void> {
    const studentRegister = await this.stundentRepo.findByRa(ra)
    if (studentRegister === null)
      throw new Error("student_not_found")

    studentRegister.name = student.name ?? studentRegister.name
    studentRegister.email = student.email ?? studentRegister.email

    await this.stundentRepo.update(studentRegister)
  }
}
