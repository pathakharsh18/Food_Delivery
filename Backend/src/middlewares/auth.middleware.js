const foodPartnerModel= require("../models/foodpartner.model")
const jwt=require("jsonwebtoken")
const userModel=require("../models/user.model")

async function authFoodPartnerMiddleware(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Please login first"
        })
    }

    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const foodPartner=await foodPartnerModel.findById(decode.id);
        req.foodPartner=foodPartner
        next()
    }
    catch(err){
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

async function authUserMiddleware(req,res,next){
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({
            message:"Please login first"
        })
    }
    try{
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        const user= await userModel.findById(decode.id)
        req.user=user;
        next()
    }
    catch(err){
        console.log(err)
        return res.status(401).json({
            message:"Invalid token"
        })
    }
}

module.exports={
    authFoodPartnerMiddleware,
    authUserMiddleware
}