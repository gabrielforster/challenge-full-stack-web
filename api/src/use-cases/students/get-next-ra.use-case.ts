import { StudentRepository } from "../../repositories/students/interface";

export class GetNextRaUseCase {
  constructor (private readonly stundentRepo: StudentRepository) { }

  async execute (): Promise<string> {
    const nextRa = await this.stundentRepo.getNextRa();
    return nextRa;
  }
}
