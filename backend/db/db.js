const mongoose = require("mongoose")


mongoose.connect(process.env.MONGO_URL)


const userSchema = new mongoose.Schema({
    userName : {type:String, minLength:5, maxLength:20, trim:true, lowercase:true},
    password : {type:String},
    firstName : {type:String},
    lastName: {type:String}
})

const User = mongoose.model('User',userSchema)

module.exports = {
    User
};