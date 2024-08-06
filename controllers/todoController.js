import { Todo } from '../models/todoModel.js'

export const addTodo = async (req, res) => {
    try {
        const { task, description, userId, projectId } = req.body
        console.log('Validation failed:', { task, description, userId, projectId });

         if (!task || !userId || !projectId || !description) {
            return res.status(400).json({ message: 'Task, Description, Project Id User Id are required.' });
        }

        const existingTodo = await Todo.findOne({ task, description, userId, projectId });
        console.log(existingTodo);
        
        if (existingTodo) {
            return res.status(409).json({ message: 'A todo with already exists for this user and project.' });
        }

        const newTodo = new Todo({
            task,
            description,
            projectId,
            status: 'pending' 
        });

        await newTodo.save();

        return res.status(201).json({ message: 'Todo added successfully.', todo: newTodo });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const getTodos = async (req, res) => {
    try {
        const { projectId } = req.query
        console.log(projectId);
        if ( !projectId ) {
            return res.status(400).json({ message: 'Project Id required.' });
        }
        const newTodo = await Todo.find({projectId})

        return res.status(201).json({ message: 'Todo added successfully.', todo: newTodo });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

