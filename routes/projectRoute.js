import express from 'express'
import sanitizeInput from '../middlewares/sanitization.js'
import auth from '../middlewares/auth.js'
import {
    addProject,
    getProjects,
    editProject,
    deleteProject,
    getProjectDetails

} from '../controllers/projectController.js'

const projectRouter = express.Router()

projectRouter.post('/addproject', auth, sanitizeInput, addProject)
projectRouter.get('/getprojects', auth, getProjects)
projectRouter.get('/getprojectdetails', auth, getProjectDetails)
projectRouter.patch('/editproject', auth, sanitizeInput, editProject)
projectRouter.put('/deleteproject', auth, deleteProject)






export default projectRouter
