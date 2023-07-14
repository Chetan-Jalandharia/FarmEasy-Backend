require('dotenv').config()
const express = require('express')
const cors = require("cors")
const app = express()
const port = process.env.PORT || 8000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// database connectivity and seeding
const db = require('./config/db')
const seed = require('./common/seed')

//  creating admin routes
const adminroute = require('./routes/adminRoute')
app.use('/admin', adminroute)

//  creating User routes
const userRoute = require('./routes/userRoute')
app.use('/user', userRoute)

//  creating customer routes 
const customerRoute = require('./routes/customerRoute')
app.use('/customer', customerRoute)

app.get("/", (req, res) => {
    res.send("Welcome to server")
})

app.get("/*", (req, res) => {
    res.send("404 Not Found")
})

app.listen(port, () => {
    console.log(`server running at port ${port}`);
}) 
