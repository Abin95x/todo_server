import { Project } from '../models/projectModel.js'


export const addProject = async (req, res) => {
    try {
        const { name, userId } = req.body
        if (!name || !userId) {
            return res.status(400).json({ message: 'Name, User Id are required.' });
        }

        const exist = await Project.findOne({ title: name, userId });

        if (exist) {
            return res.status(400).json({ message: 'Project with this name already exists' });
        }

        const newProject = new Project({ title: name, userId });
        await newProject.save();

        return res.status(201).json({ message: 'Project added successfully.', project: newProject });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const getProjects = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User Id is required.' });
        }

        const projects = await Project.find({ userId });
        return res.status(200).json({ message: 'Projects retrieved successfully.', projects });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while retrieving projects.' });
    }
}



export const editProject = async (req, res) => {
    try {

    } catch (error) {

    }
}

export const deleteProject = async (req, res) => {
    const { projectId } = req.query;
    console.log(projectId);
    try {
        const project = await Project.findByIdAndDelete(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete project', error: error.message });
    }

}