import express from 'express'
import {connectDB} from './config/dbConfig.js'
import dotenv from 'dotenv';
import userRouter from './routes/userRoute.js';
import projectRouter from './routes/projectRoute.js';
import cors from 'cors'
const app = express()
dotenv.config()

app.use(express.json())
app.use(cors({
    origin: process.env.FRONT_END_URL,
    methods: ['GET','POST','PUT','PATCH'],
    credentials: true,
}))
app.use('/',userRouter)
app.use('/project',projectRouter)


connectDB(process.env.MONGO_URL)

app.listen(process.env.PORT,()=>{
    console.log('running....');
})