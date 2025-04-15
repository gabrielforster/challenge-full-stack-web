import type { Request } from "express";

interface Repositories {
  student: StudentRepository,
}

declare global {
  namespace Express {
    interface Request {
      repositories: Repositories
    }
  }
}
