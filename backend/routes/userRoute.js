const express = require("express")
const {User, Account} = require('../db/db')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const z = require("zod")
const { authMiddleware } = require("../middleware/middleware")

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
    
    await Account.create({
        userId:newUser._id,
        balance : 1+Math.random()*10000
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


const infoSchema = z.object({
    password:z.string().optional(),
    firstName:z.string().optional(),
    lastName:z.string().optional()
})

userRouter.put("/", authMiddleware,async (req,res)=>{
 
        const inputbody = req.body
        if(!inputbody.password){
            return;
        }
        const hashedPassword = await bcrypt.hash(inputbody.password,10)   
        const body = {
            password:hashedPassword,
            firstName:req.body.firstName,
            lastName:req.body.lastName
        }


        const parsedInfo = infoSchema.safeParse(body)

        if(!parsedInfo.success){
            return res.status(400).json({
                msg:"Invalid Input data"
            })
        }

        try {
            await User.updateOne(
                {_id:req.userId},
                {$set:parsedInfo.data}
            )

            res.json({
                msg:"Updated Successfully"
            })

        } catch (error) {
            res.status(400).json({
                msg:"Internal Server Issue"
            })
        }

})


userRouter.get("/bulk", authMiddleware, async(req,res)=>{
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = userRouter