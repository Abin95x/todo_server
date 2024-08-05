import express from 'express'
import sanitizeInput from '../middlewares/sanitization.js'
import auth from '../middlewares/auth.js'
import {
    addProject,
    getProjects,
    editProject,
    deleteProject
} from '../controllers/projectController.js'

const projectRouter = express.Router()

projectRouter.post('/addproject', auth, sanitizeInput, addProject)
projectRouter.get('/getprojects', auth, getProjects)
projectRouter.put('/deleteproject', auth, deleteProject)




export default projectRouter
