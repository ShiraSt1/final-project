const User=require("../models/User")
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')

const login=async(req,res)=>{
    const {userId,password}=req.body
    if(!userId || !password )
        return res.status(400).send("userId password are required")
    const userIdExists=await User.findOne({userId:userId}).lean()
    if(!userIdExists)
        return res.status(400).send("userId doesn't exists")
    const match = await bcrypt.compare(password, userIdExists.password)    
    if(!match)
        return res.status(400).send("password not correct")
    const newuser= {_id:userIdExists._id,name:userIdExists.name,userId:userIdExists.userId,}
    const accessToken=jwt.sign(newuser,process.env.ACCESS_TOKEN_SECRET)
    res.json({accessToken:accessToken,role:userIdExists.role})
    }


module.exports={login}