const { Router } = require("express")
const userRouter = Router()
const { userModel, courseModel } = require("../db")
const { z } = require("zod")
const jwt = require("jsonwebtoken")
const {JWT_USER_PASSWORD} = require("../config")
const { purchaseModel } = require("../db")
const { userMiddleware } = require("../middleware/user")


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
        const user = await userModel.create({
            email : email,
            password : password,
            firstName : firstName, 
            lastName : lastName
        })
        return res.json({
            message : "User signed up"
        })
    }

    catch(e){
        console.log(e)
        return res.status(400).json({
            meassage : "user already exists"
        })
    }

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

userRouter.get('/purchases', userMiddleware, async function(req,res){
    const userId = req.userId;
    const purchases = await purchaseModel.find({
        userId,
    })

    let purchasedIds = [];
    for(let i=0;i<purchases.length;i++){
        purchasedIds.push(purchases[i].courseId);
    }

    const courseData = await courseModel.find({
        _id : { $in : purchasedIds }
    })

    res.json({
        message:"purchases made:",
        courseData
    })
})

module.exports = {
    userRouter : userRouter
}