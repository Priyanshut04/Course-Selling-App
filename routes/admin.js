const { Router } = require('express')
const { adminModel } = require('../db')
const { z } = require("zod")
const jwt = require("jsonwebtoken")
const adminRouter = Router()
const { JWT_ADMIN_PASSWORD } = require("../config")
const { adminMiddleware } = require('../middleware/admin')
const { courseModel } = require("../db")


adminRouter.post('/signup', async function(req,res){

    const { email, password, firstName, lastName } = req.body
    //zod validation and hashing

    const adminSchema = z.object({
        email: z.string().email(),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
    });
    
    adminRouter.post('/signup', async (req, res) => {
        const { email, password, firstName, lastName } = req.body;
    
        // Validate input using Zod
        const validationResult = adminSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ message: "Invalid input", errors: validationResult.error.errors });
        }
    });
    
    try{
        await adminModel.create({
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

adminRouter.post('/signin', async function(req,res){
    const { email, password } = req.body

    const admin = await adminModel.findOne({
        email:email,
        password:password
    })

    if(admin){
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);

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

adminRouter.post('/course',adminMiddleware, async function(req,res){
    const adminId = req.adminId

    const { title, description, imgUrl, price } = req.body

    try{
        const course = await courseModel.create({
            title: title,
            description: description,
            price: price,
            imgUrl: imgUrl,
            creatorId: adminId
        })

        res.json({
            message: "course created",
            courseId: course._id
        })
    }
    catch(e){
        console.log(e)
    }


    res.json({
        message:"purchases endpoint"
    })
})

adminRouter.put('/course',(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})

adminRouter.get('/course/bulk',(req,res)=>{
    res.json({
        message:"purchases endpoint"
    })
})



module.exports = { adminRouter:adminRouter }