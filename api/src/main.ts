import express from "express"
import helmet from "helmet"

const port = process.env.PORT ?? 42690
const app = express()

app.use(helmet())

app.get("/health", (req, res) => {
  res.status(200).json({ health: "ok" })
})

app.listen(port, () => {
  console.info(`server listening on: ${port}`)
})
