import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import {findUserByEmail,CreateUser} from '../models/UserModel.js'

const register =async(req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }
        const existingUser=await findUserByEmail(email);
        if(existingUser){
            return res.status(400).json({error:"User already exists"});
        }
        const salt=await bcrypt.genSalt(10);
        const password_hash=await bcrypt.hash(password,salt);
        const newUser=await CreateUser(email,password_hash);
        const token=jwt.sign({userId:newUser.id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(201).json({message:"User registered successfully",user:newUser,token});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

const login =async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({error:"Email and password are required"});
        }
        const user=await findUserByEmail(email);
        if(!user){
            return res.status(400).json({error:"Invalid credentials"});
        }
        const isMatch=await bcrypt.compare(password,user.password_hash);
        if(!isMatch){
            return res.status(400).json({error:"Invalid credentials"});
        }
        const token=jwt.sign({userId:user.id},process.env.JWT_SECRET,{expiresIn:'1d'});
        res.status(200).json({message:"Login successful",user,token});
    }catch(error){
        res.status(500).json({error:error.message});
    }
}

export{register,login}