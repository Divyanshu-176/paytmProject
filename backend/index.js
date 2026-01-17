require('dotenv').config()
const express = require("express");
const cors = require("cors")
const userRouter = require("./routes/userRoute");
const accountRouter = require('./routes/accountRoute');


const app = express()
app.use(cors())
app.use(express.json())


app.use("/api/v1/user", userRouter)
app.use("/api/v1/account", accountRouter)

app.listen(3000)
console.log("Server Running")