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

adminRouter.put('/course', adminMiddleware, async function(req, res) {
    const adminId = req.adminId;
    const { title, description, imgUrl, price, courseId } = req.body;

    try {
        const course = await courseModel.updateOne(
            { _id: courseId, creatorId: adminId }, // Ensure admin owns the course
            { title, description, price, imgUrl }
        );

        if (course.modifiedCount === 0) {
            return res.status(403).json({
                message: "Course not updated. Either course does not exist or you are not authorized."
            });
        }

        res.json({
            message: "Course updated successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});


adminRouter.get('/course/bulk', adminMiddleware, async function(req,res){
    const adminId  = req.adminId

    try {
        const courses = await courseModel.find({
            creatorId : adminId
        })
        res.json({
            message:"List of all the courses.",
            courses
        })
    } catch (error) {
        console.log(e)
        res.json({
            message:"Issue in fetching courses."
        })
    }
})



module.exports = { adminRouter:adminRouter }