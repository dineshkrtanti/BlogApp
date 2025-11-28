const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const dotenv = require('dotenv')
const connectDB = require("./config/db")

// env config
dotenv.config()

// router imports
const userRoute = require('./routes/userRoutes')
const blogRoute = require('./routes/blogRoutes')

// mongdb connection
connectDB()


const app = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/blog', blogRoute)

// app.get('/', (req,res)=>{
//     res.status(200).send({
//         "message" : "node server started successfully"
//     })
// })



// port
const PORT = process.env.PORT || 8090

// listen
app.listen(PORT, ()=>{
    console.log(`Server running on ${process.env.DEV_NODE} port no. ${PORT}`);
    
})