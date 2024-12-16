const express = require('express')
const cors = require('cors')
require("dotenv").config()
const bodyParser = require('body-parser')
const app = express()
const connectDB = require('./config/db')
const productRoute = require('./route/productRoute')
const userRoute = require('./route/userRoute')
const cookieParser = require('cookie-parser')

const PORT = 5000


app.use(express.json())


const allowedOrigins = [
    'https://zoro-new-frontend.vercel.app',
    'http://localhost:3000'
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],    
    credentials: true 
  }));
app.use(cookieParser())

connectDB()

app.use('/Product', productRoute)
app.use('/Category',productRoute)
app.use('/Trends',productRoute)
app.use('/Users',userRoute)
app.use('/Login',userRoute)
app.use('/Ban',userRoute)


app.listen(PORT, ()=>{
    console.log(`Server is listening on the port ${PORT}`)
})