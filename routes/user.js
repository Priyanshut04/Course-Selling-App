const { Router } = require("express")
const userRouter = Router()
const { userModel } = require("../db")
const { z } = require("zod")
const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config")


userRouter.post('/signup', async function(req,res){
    const { email, password, firstName, lastName } = req.body
    //zod validation and hashing
    const userSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
    });
    
    userRouter.post('/signup', async (req, res) => {
        const { email, password, firstName, lastName } = req.body;
    
        // Validate input using Zod
        const validationResult = userSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult.error.errors });
        }
    });
    
    try{
        await userModel.create({
            email : email,
            password : password,
            firstName : firstName, 
            lastName : lastName
        })
    }

    catch(e){
        console.log(e)
        return res.status(400).json({
            meassage : "user already exists"
        })
    }


    res.json({
        message:"signup endpoint"
    })
})

userRouter.post('/signin',async function(req,res){
    const { email, password } = req.body

    const user = await userModel.findOne({
        email:email,
        password:password
    })

    if(user){
        const token = jwt.sign({
            id: user._id
        }, JWT_USER_PASSWORD);

        res.json({
            token:token
        })
    }
    else{
        res.status(403).json({
            message:"Incorrect Credentials"
        })
    }
})

userRouter.get('/purchases',(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})

module.exports = {
    userRouter : userRouter
}