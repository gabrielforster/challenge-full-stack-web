// tests/studentUseCases.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { MemoryStudentRepository } from "../src/repositories/students/student.memory.repository";
import { RegisterStudentUseCase } from "../src/use-cases/students/register-students.use-case";
import { ListStudentsUseCase } from "../src/use-cases/students/list-students.use-case";
import { GetStudentByRaUseCase } from "../src/use-cases/students/get-student-by-ra.use-case";
import { DeleteStundentUseCase } from "../src/use-cases/students/delete-student.use-case";

const makeStudent = (overrides = {}) => ({
  name: "Alice",
  email: "alice@example.com",
  ra: "000001",
  cpf: "12345678901",
  ...overrides,
});

describe("Student Use Cases", () => {
  let repo: MemoryStudentRepository;

  beforeEach(() => {
    repo = new MemoryStudentRepository();
  });

  it("registers a new student", async () => {
    const useCase = new RegisterStudentUseCase(repo);
    const studentData = makeStudent();
    const created = await useCase.execute(studentData);
    expect(created).toMatchObject({ name: "Alice", email: "alice@example.com", ra: "000001" });
  });

  it("throws if registering a student with existing email", async () => {
    const useCase = new RegisterStudentUseCase(repo);
    const studentData = makeStudent();
    await useCase.execute(studentData);
    await expect(useCase.execute(studentData)).rejects.toThrow("student_already_exists");
  });

  it("lists all students", async () => {
    const register = new RegisterStudentUseCase(repo);
    const studentOne = makeStudent({ name: "Alice", email: "alice@example.com", ra: "000001" })
    const studentTwo = makeStudent({ name: "Bob", email: "bob@example.com", ra: "000002" })
    await register.execute(studentOne);
    await register.execute(studentTwo);

    const list = new ListStudentsUseCase(repo);
    const students = await list.execute();
    expect(students.length).toBe(2);
    expect(students.map((s) => s.name)).toContain("Alice");
    expect(students.map((s) => s.name)).toContain("Bob");
  });

  it("deletes a student and they no longer appear in the list", async () => {
    const register = new RegisterStudentUseCase(repo);

    const studentOne = makeStudent({ name: "Alice", email: "alice@example.com", ra: "000001" })
    const studentTwo = makeStudent({ name: "Bob", email: "bob@example.com", ra: "000002" })
    await register.execute(studentOne);
    await register.execute(studentTwo);

    const del = new DeleteStundentUseCase(repo);
    await del.execute("000001");

    const list = new ListStudentsUseCase(repo);
    const students = await list.execute();
    expect(students.length).toBe(1);
    expect(students[0].name).toBe("Bob");
  });

  it("gets a student by RA", async () => {
    const register = new RegisterStudentUseCase(repo);
    const studentToRegister = makeStudent({ name: "Alice", email: "alice@example.com", ra: "000001" })
    await register.execute(studentToRegister);

    const getByRa = new GetStudentByRaUseCase(repo);
    const student = await getByRa.execute("000001");
    expect(student).not.toBeNull();
    expect(student?.name).toBe("Alice");
  });

  it("returns null if student by RA does not exist", async () => {
    const getByRa = new GetStudentByRaUseCase(repo);
    const student = await getByRa.execute("999999");
    expect(student).toBeNull();
  });
});

