const userModel=require('../models/user.model');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');


async function registerUser(req,res){
    const {fullname:{firstname,lastname},email,password}=req.body;

    const isuserAlreadyRegistered=await userModel.findOne({email})

    if(isuserAlreadyRegistered){
        return res.status(400).json({message:"User already registered"})
    }


    const hashedPassword=await bcrypt.hash(password,10);

    const user=await userModel.create({
        fullname:{firstname,lastname},
        email,
        password:hashedPassword
    })

    const token=jwt.sign({id:user._id,},process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({message:"User registered successfully",
        user:{id:user._id,fullname:user.fullname,email:user.email}

    })
}

async function loginUser(req,res){
    const {email,password}=req.body;

    const user=await userModel.findOne({
        email
    })
    if(!user){
        return res.status(400).json({message:"invalid email or password"})
    }
    const isPasswordCorrect=await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"invalid email or password"})
    }

    const token=jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.cookie("token",token)

    res.status(200).json({message:"User logged in successfully",
    user:{id:user._id,fullname:user.fullname,email:user.email}
    })
}

module.exports={registerUser,loginUser} ;