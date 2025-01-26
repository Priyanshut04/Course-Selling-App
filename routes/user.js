const { Router } = require("express")
const userRouter = Router()

userRouter.get('/login',(req,res)=>{
    res.json({
        message:"login endpoint"
    })
})

userRouter.get('/signup',(req,res)=>{
    res.json({
        message:"signup endpoint"
    })
})

userRouter.get('/signin',(req,res)=>{
    res.json({
        message:"signin endpoint"
    })
})

userRouter.get('/purchase',(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})

module.exports = {
    userRouter : userRouter
}