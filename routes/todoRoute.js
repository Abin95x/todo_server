import express from 'express'
import sanitizeInput from '../middlewares/sanitization.js'
import auth from '../middlewares/auth.js'
import {
    addTodo,
    getTodos

    
} from '../controllers/todoController.js'

const todoRouter = express.Router()

todoRouter.post('/addtodo', auth, sanitizeInput, addTodo)
todoRouter.get('/gettodos', auth, getTodos)
todoRouter.patch('/updatetodo', auth, sanitizeInput, )
todoRouter.put('/deletetodo', auth, )




export default todoRouter
