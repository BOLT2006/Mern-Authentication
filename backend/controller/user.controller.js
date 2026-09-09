import { User } from "../models/user.model.js"
import bcrypt from  "bcryptjs"
import jwt  from "jsonwebtoken"
import { verifyMail } from "../emailVerify/verifyMail.js"
/* User Register */
const userRegister = async(req , res) => {
    try {
        // get user from frontend
        const {username , email , password } = req.body
        // validation
        if(!username || !email || !password){
            return res.status(400).json({
                success : false,
                message : "All fields are required"
            })
        }
        // check if user already exist or not
        const existingUser =  await User.findOne({email})
        if(existingUser){
            return res.status(400).json({
                success : false,
                message : "User already exists"
            })
        }
        // create new User
        // bcrypt : is used to securely hash password
        const hashedPassword = await bcrypt.hash(password , 10) 
        const newUser = await User.create({
            username,
            email,
            password : hashedPassword
        })
        //create JWT Token
        const token = jwt.sign({id : newUser._id} , process.env.SECRET_KEY , {expiresIn : "10m"})
        // Mail
        verifyMail(token , email)
        // save the token
        newUser.token = token
        await newUser.save()
        return res.status(201).json({
            success : true,
            message : "User  Registered Successfully",
            data : newUser
        })
    } catch (error) {
        return res.status(500).json({
            success : false,
            message : error.message
        })
    }
}
export {
    userRegister
}