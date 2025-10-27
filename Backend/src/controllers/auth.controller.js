const userModel=require("../models/user.model")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const foodPartnerModel=require("../models/foodpartner.model")


async function registerUser(req,res) {
    const{fullName,email,password}=req.body;
    
    const isUserAlreadyExsist=await userModel.findOne({
        email
    })
    if(isUserAlreadyExsist){
        return res.status(400).json({
            message:"User already Exists"
        })
    }
// userModel.create({
//     fullName,email,password:hasedPass
// })
    const hasedPass=await bcrypt.hash(password,10);
    const user=await userModel.create({
        fullName,
        email,
        password:hasedPass
    })

    const token=jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        message:"User registered Successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })

}

async function loginUser(req,res){
    const{email,password}=req.body;

    const user=await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)

    if(!isPasswordValid){
        return res.status(400).json({
            message:"Invalid email or password"
        })
    }
    //user bhi mil gya aur password bhi mil gya to ek token generate kar lunga
    const token=jwt.sign({
        id:user._id,
    },process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(200).json({
        message:"User registered successfully",
        user:{
            _id:user._id,
            email:user.email,
            fullName:user.fullName
        }
    })
}

function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message:"User logged out Successfully"
    });
}

async function registerFoodPartner(req,res) {
    const { name,email,password,phone,contactName,address}=req.body;
    const isAccountAlredyExist=await foodPartnerModel.findOne({
        email
    })
    if(isAccountAlredyExist){
        res.status(400).json({
            message:"Food partner account already exist"
        })
    }

    const hasedPass=await bcrypt.hash(password,10)
    const foodPartner=await foodPartnerModel.create({
        name,
        email,
        password:hasedPass,
        phone,
        contactName,
        address
    })

    const token=jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(201).json({
        message:"Food partner registered Successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name

        }
    })
}

async function loginFoodPartner(req,res){
    const {email,password}= req.body;

    const foodPartner= await foodPartnerModel.findOne({
        email
    })
    if(!foodPartner){
        res.status(400).json({
            message:"Invalid email or Password"
        })
    }
    const isPasswordValid=await bcrypt.compare(password,foodPartner.password)
    if(!isPasswordValid){
        res.status(400).json({
            message:"inavlid email or password"
        })
    }
    const token=jwt.sign({
        id:foodPartner._id,
    },process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(200).json({
        message:"food partner logged in successfully",
        foodPartner:{
            _id:foodPartner._id,
            email:foodPartner.email,
            name:foodPartner.name
        }
    })
}

function logoutFoodPartner(req,res){
    res.clearCookie("token")
    res.status(200).json({
        message:"food partner logged out successfully"
    })
}


module.exports={
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
}