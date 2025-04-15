import { Student } from "../../entities/student";
import { StudentRepository } from "../../repositories/students/interface";

export class ListStudentsUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (): Promise<Student[]> {
    const stundets = await this.stundentRepo.listAll();
    return stundets
  }
}
