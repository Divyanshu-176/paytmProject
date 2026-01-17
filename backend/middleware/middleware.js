const authMiddleware = (req,res,next)=>{
    const token = req.headers.token;

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded
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