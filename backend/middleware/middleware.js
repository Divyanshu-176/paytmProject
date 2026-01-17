const jwt = require("jsonwebtoken")

const authMiddleware = (req,res,next)=>{
    const token = req.headers['token'];
    if(!token){
        return res.status(401).json({
            msg:"No Token Provided"
        })
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    }
    catch(e){
        return res.status(403).json({
            msg:"Not authorized"
        })
    }
}


module.exports={
    authMiddleware
}