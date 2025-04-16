import { StudentRepository } from "../../repositories/students/interface";

export class DeleteStundentUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (ra: string): Promise<void> {
    await this.stundentRepo.delete(ra)
  }
}
