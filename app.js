import express from "express"

const app = express()

app.get("/", (request, response) => {
  response.json({
    message: "Your server is running!"
  })
})

app.listen(process.env.PORT || 80)
