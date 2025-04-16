import { Router } from "express"

import { registerStudentSchema } from "../schemas/register-student.schema"
import { updateStudentSchema } from "../schemas/update-student.schema"
import { parseBodyMiddleware } from "../middlewares/parse-body.middleware"
import { RegisterStudentUseCase } from "../use-cases/students/register-students.use-case"
import { ListStudentsUseCase } from "../use-cases/students/list-students.use-case"
import { GetNextRaUseCase } from "../use-cases/students/get-next-ra.use-case"
import { GetStudentByRaUseCase } from "../use-cases/students/get-student-by-ra.use-case"
import { UpdateStundentUseCase } from "../use-cases/students/update-student.use-case"
import { DeleteStundentUseCase } from "../use-cases/students/delete-student.use-case"

export const studentsController = Router()

studentsController.post(
  "/",
  parseBodyMiddleware(registerStudentSchema),
  async (req, res) => {
    try {
      const student = await new RegisterStudentUseCase(req.repositories.student).execute(req.body)
      res.status(201).json(student);
      return;
    } catch (err) {
      if (err instanceof Error && err.message === "student_already_exists") {
        res.status(409).json({
          message: "student_already_exists",
          errors: [
            {
              field: "email",
              message: "email already registered"
            }
          ]
        })
        return;
      }

      console.error("err", err)

      // TODO: change to a global error handler if error is not handled on controller
      res.status(500).json({
        message: "Internal server error"
      })
      return;
    }
  }
)

studentsController.patch(
  "/",
  parseBodyMiddleware(updateStudentSchema),
  async (req, res) => {
    const { ra, ...student } = req.body
    try {
      await new UpdateStundentUseCase(req.repositories.student).execute(ra, student)
      res.status(202).json({ ok: true })
      return
    } catch (err) {
      if (err instanceof Error && err.message === "student_not_found") {
        res.status(404).json({
          message: "student_not_found",
        })
        return
      }

      console.error("err", err)
      res.status(500).json({
        message: "Internal server error"
      })
      return
    }
  }
)

studentsController.delete("/:ra", async (req, res) => {
  const { ra } = req.params
  await new DeleteStundentUseCase(req.repositories.student).execute(ra)
  res.status(202).json({ ok: true })
  return
})

studentsController.get("/", async (req, res) => {
  const list = await new ListStudentsUseCase(req.repositories.student).execute()
  res.status(200).json(list);
  return
})

studentsController.get("/next-ra", async (req, res) => {
  const nextRa = await new GetNextRaUseCase(req.repositories.student).execute()
  res.status(200).json({ ra: nextRa });
  return
})

studentsController.get("/:ra", async (req, res) => {
  const { ra } = req.params
  const student = await new GetStudentByRaUseCase(req.repositories.student).execute(ra)

  if (student === null) {
    res.status(404).json({
      message: "student_not_found",
    })
    return
  }

  res.status(200).json(student);
  return
})

