import { Project } from '../models/projectModel.js'
import { Todo } from '../models/todoModel.js'
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

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
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const getProjectDetails = async (req, res) => {
    try {
        const { projectId } = req.query;
        const project = await Project.findById(projectId)

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        return res.status(200).json({ message: 'Project retrieved successfully.', project });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const editProject = async (req, res) => {
    try {
        const { projectId } = req.query;
        const { title } = req.body;

        if (!projectId || !title) {
            return res.status(400).json({ message: "Project ID and title are required" });
        }

        const updatedProject = await Project.findByIdAndUpdate(
            projectId,
            { title },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json(updatedProject);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};


export const deleteProject = async (req, res) => {
    const { projectId } = req.query;
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

const __filename = fileURLToPath(import.meta.url);
const currentDir = '/home/abin/Desktop/New Folder/server/controllers';
const __dirname = path.dirname(currentDir);

const ensureDirectoryExistence = async (filePath) => {
    const dir = path.dirname(filePath);
    try {
        await fs.access(dir);
    } catch (err) {
        await fs.mkdir(dir, { recursive: true });
    }
};

export const createMd = async (req, res) => {
    try {
        const { projectId } = req.query;

        // Fetch project data to get the project title
        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Fetch todos for the project
        const todos = await Todo.find({ projectId: projectId });
        if (!todos.length) {
            return res.status(404).json({ error: 'No todos found for this project' });
        }

        const publicDir = path.join(__dirname, 'public', 'files');

        const filePath = path.join(publicDir, `${project.title}.md`);

        // Ensure the directory exists
        await ensureDirectoryExistence(filePath);

        let pendingList = '';
        let completedList = '';
        let countCompleted = 0;

        todos.forEach((element) => {
            if (element.status === 'done') {
                countCompleted++;
                completedList += `- [x] ${element.description}\n`;
            } else {
                pendingList += `- [ ] ${element.description}\n`;
            }
        });

        const text = `# ${project.title}

**Summary**: ${countCompleted}/${todos.length} Todos Completed 

# Pending 
${pendingList}

# Completed 
${completedList}
`;

        await fs.writeFile(filePath, text);

        const gistData = {
            description: 'Project Summary with Tasks',
            public: false,
            files: {
                [`${project.title}.md`]: {
                    content: text,
                },
            },
        };

        const response = await axios.post('https://api.github.com/gists', gistData, {
            headers: {
                Authorization: `token ${process.env.GITHUB_TOKEN}`,
            },
        });

        res.json({ url: response.data.html_url });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};