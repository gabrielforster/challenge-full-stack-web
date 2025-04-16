import { Student } from "../../entities/student";
import { StudentRepository } from "../../repositories/students/interface";

export class GetStudentByRaUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (ra: string): Promise<Student | null> {
    const student = await this.stundentRepo.findByRa(ra)
    return student
  }
}
