const express = require("express")
const {authMiddleware} = require('../middleware/middleware')
const {Account} = require("../db/db")
const mongoose = require("mongoose")
const accountRouter = express.Router()




accountRouter.get("/balance", authMiddleware, async(req, res)=>{
     try {
        const account = await Account.findOne({
            userId:req.userId
        })
        if (!account) {
            return res.status(404).json({ msg: "Account not found" })
        }

        res.json({
            balance: account.balance
        })
     } catch (error) {
        res.status(411).json({
            msg:"error occurred"
        })
     }
})



accountRouter.post("/transfer", authMiddleware, async(req,res)=>{
    const session = await mongoose.startSession();
    
    session.startTransaction();
    const {amount, to} = req.body;
    
    const account = await Account.findOne({userId:req.userId}).session(session)

    if(!account || account.balance < amount){
        await session.abortTransaction();
        return res.status(400).json({
            msg:"Insufficient Balance"
        })
    }

    const toAccount = await Account.findOne({userId:to}).session(session)

    if(!toAccount){
        await session.abortTransaction()
        res.status(400).json({
            msg:"Account not found"
        })
    }
   

    await Account.updateOne({userId: req.userId}, {$inc:{balance:-amount}}).session(session)
    await Account.updateOne({userId: to}, {$inc:{balance:amount}}).session(session)

    await session.commitTransaction()
    res.json({
        msg:"Transfer Successfull"
    })

})




module.exports= accountRouter



