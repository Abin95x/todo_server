import express from 'express'
import sanitizeInput from '../middlewares/sanitization.js'
import auth  from '../middlewares/auth.js'
import {
    userSignup,
    userLogin,
} from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/signup', sanitizeInput, userSignup)
userRouter.post('/login', sanitizeInput, userLogin)


export default userRouter
