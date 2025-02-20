const express = require('express')
const mongoose = require('mongoose')
const { userRouter } = require('./routes/user')
const { courseRouter } = require('./routes/course')
const { adminRouter } = require('./routes/admin')

const app = express()

app.use('/user',userRouter)
app.use('/admin',adminRouter)
app.use('/course',courseRouter)

async function main() {
    await mongoose.connect("mongodb+srv://priyanshutiwarip403:3jqaf92j5EhzsBb8@cluster0.venjq.mongodb.net/coursera-app")
    app.listen(3000, ()=>{
        console.log('App is listening on port 3000')
    })
}

main()