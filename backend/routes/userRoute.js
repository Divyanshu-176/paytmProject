const express = require("express")
const {User} = require('../db/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const z = require("zod")

const userRouter = express.Router()




const userZodSchema = z.object({
    userName:z.string().min(5).max(20),
    password:z.string(),
    firstName:z.string(),
    lastName:z.string()
})


userRouter.post("/signup", async (req,res)=>{

    try {
        
    const body = req.body;  
    const parsedBody = userZodSchema.safeParse(body)

    if(!parsedBody.success){
        console.log("error",parsedBody.error.errors)
        return res.status(411).json({
            msg:"Incorrect Input, Check again!"
        })
    }


    const existingUser = await User.findOne({
        userName:parsedBody.data.userName
    })
    if(existingUser){
        return res.status(411).json({
            msg:"User Already Exists!"
        })
    }


    
    const newUser = await User.create({
        userName:parsedBody.data.userName,
        password: await bcrypt.hash(parsedBody.data.password, 10),
        firstName:parsedBody.data.firstName,
        lastName:parsedBody.data.lastName
    })
    res.status(200).json({
        msg:"New user Signed Up!"
    })

    } catch (error) {
        res.status(500).json({
            msg:"Internal Server Error!"
        })
    }


})


userRouter.post("/signin", async (req,res)=>{
    try {
        const body = req.body;
        const parsedBody = userZodSchema.safeParse(body)

        if(!parsedBody.success){
            return res.status(411).json({
                msg:"Incorrect Input, Check again!"
            })
        }

        const existingUser = await User.findOne({
            userName:parsedBody.data.userName
        })
        if(!existingUser){
            return res.status(411).json({
                msg:"User doesnt exist"
            })
        }

        const passwordCompare = await bcrypt.compare(parsedBody.data.password, existingUser.password)

        if(!passwordCompare){
            return res.status(411).json({
                msg:"Incorrect password"
            })
        }


        const token = jwt.sign({
            userId:existingUser._id
        }, process.env.JWT_SECRET)

        res.json({
            token:token
        })


    } catch (error) {
        res.status(500).json({
            msg:"Internal server error"
        })
    }
})

module.exports = userRouter