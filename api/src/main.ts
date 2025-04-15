import express from "express"
import helmet from "helmet"
import cors from "cors"

import { studentsController } from "./controllers/students.controller"
import { PostgresStudentRepository } from "./repositories/students/student.postgres.repository"
import knex from "knex"

const port = process.env.PORT ?? 42690
const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors())

const dbConn = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
  },
})

app.use((req, _, next) => {
  req.repositories = {
    student: new PostgresStudentRepository(dbConn)
  }

  next()
})

app.use("/students", studentsController)

app.get("/health", (req, res) => {
  res.status(200).json({ health: "ok" })
})

app.listen(port, () => {
  console.info(`server listening on: ${port}`)
  console.info(`database connection: ${process.env.DATABASE_URL}`)
})
