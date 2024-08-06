import { Todo } from '../models/todoModel.js'

export const addTodo = async (req, res) => {
    try {
        const { task, description, userId, projectId } = req.body

        if (!task || !userId || !projectId || !description) {
            return res.status(400).json({ message: 'Task, Description, Project Id User Id are required.' });
        }

        const existingTodo = await Todo.findOne({ task, description, userId, projectId });

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

        if (!projectId) {
            return res.status(400).json({ message: 'Project Id required.' });
        }
        const newTodo = await Todo.find({ projectId })

        return res.status(201).json({ message: 'Todo added successfully.', todo: newTodo });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const markTodo = async (req, res) => {
    try {
        const { todoId } = req.query
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }
        todo.status = (todo.status === 'pending') ? 'done' : 'pending';
        await todo.save();

        return res.status(200).json({ message: 'Todo status updated successfully.', todo });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { todoId } = req.query;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        await Todo.findByIdAndDelete(todoId);
        return res.status(200).json({ message: 'Todo deleted successfully.' });

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}

export const updateTodo = async (req, res) => {
    try {
        const { todoId } = req.query;
        const details = req.body;
        const todo = await Todo.findById(todoId);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found.' });
        }

        Object.assign(todo, details);
        await todo.save();
        return res.status(200).json(todo);

    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error: error.message });
    }
}




