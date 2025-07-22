import Task from '../models/task.js';

export const createTask = async (req, res) => {
    try {
        const task = new Task({ ...req.body, project: req.params.projectId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error creating task', error });
    }
};

export const getTasksByProject = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.projectId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching task', error });
    }
};

export const assignTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { assignedTo: req.body.userId }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error assigning task', error });
    }
};

export const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { status: req.body.status }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error updating task status', error });
    }
};

export const setDependencies = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.taskId, { dependencies: req.body.dependencies }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ message: 'Error setting dependencies', error });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Error deleting task', error });
    }
};
