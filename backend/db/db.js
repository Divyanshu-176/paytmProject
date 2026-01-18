const mongoose = require("mongoose")


mongoose.connect(process.env.MONGO_URL)


const userSchema = new mongoose.Schema({
    userName : {type:String, minLength:5, maxLength:50, trim:true, lowercase:true},
    password : {type:String},
    firstName : {type:String},
    lastName: {type:String}
})

const accountSchema = new mongoose.Schema({
    balance:{type:Number, required:true},
    userId:{type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"}
})

const User = mongoose.model('User',userSchema)
const Account = mongoose.model('Account', accountSchema)

module.exports = {
    User, Account
};