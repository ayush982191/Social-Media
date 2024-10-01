
import jwt from "jsonwebtoken";

const isAuthenticated = async(req,res,next)=>{
    try { 
        
        const token = req?.cookies?.token; 
        if(!token){
            return res.status(401).json({
                message : "User not authenticated",
                success : false
            })
        } 
        const decode = await jwt.verify(token,process.env.SECERET_KEY); 
        if(!decode){
            return res.status(401).json({
                success : false,
                message : "invalid"
            })
        } 
        req.id = decode.userId; 
        next();

    } catch (error) {
        console.log("error in authentication ",error.message)
    }
}

export default isAuthenticated;