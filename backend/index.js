require('dotenv').config()
const express = require("express");
const cors = require("cors")
const userRouter = require("./routes/userRoute")


const app = express()
app.use(cors())
app.use(express.json())


app.use("/api/v1/user", userRouter)


app.listen(3000)
console.log("Server Running")