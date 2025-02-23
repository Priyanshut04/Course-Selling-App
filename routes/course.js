const { Router } = require('express')
const courseRouter = Router()
const { courseModel, purchaseModel } = require("../db")
const { userMiddleware } = require("../middleware/user")

courseRouter.post('/purchase', userMiddleware, async function(req,res){
    const userId = req.userId
    const courseId = req.body.courseId
    try {
        await purchaseModel.create({
            userId,
            courseId
        })
        return res.json({
            message:"Course bought successfully."
        })
    } catch (error) {
        console.log(error)
        return res.json({
            message:"Issue in buying course."
        })
    }
})

courseRouter.get('/preview', async function(req,res){
    const courses = await courseModel.find({});
    res.json({
        message:"all courses:",
        courses
    })
})

module.exports = {
    courseRouter : courseRouter
}