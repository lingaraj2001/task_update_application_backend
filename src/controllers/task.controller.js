const { Task } = require('../models');
const { Op } = require('sequelize');

// Get all tasks for logged-in user with filters
exports.getAllTasks = async (req, res) => {
    try {
        const { status, priority, q } = req.query;
        const whereClause = { userId: req.userId };

        // Apply Status Filter
        if (status && status !== 'All') {
            whereClause.status = status;
        }

        // Apply Priority Filter
        if (priority && priority !== 'All') {
            whereClause.priority = priority;
        }

        // Apply Text Search Filter (Case Insensitive)
        if (q && q.trim() !== '') {
            whereClause[Op.or] = [
                { title: { [Op.iLike]: `%${q}%` } },
                { description: { [Op.iLike]: `%${q}%` } }
            ];
        }

        const tasks = await Task.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            tasks
        });
    } catch (err) {
        console.error('Error fetching tasks:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve tasks due to server error.'
        });
    }
};

// Get single task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or unauthorized.'
            });
        }

        return res.status(200).json({
            success: true,
            task
        });
    } catch (err) {
        console.error('Error fetching task by ID:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve task.'
        });
    }
};

// Create a new task
exports.createTask = async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === '') {
        return res.status(400).json({
            success: false,
            message: 'Task title is required.'
        });
    }

    try {
        const newTask = await Task.create({
            title,
            description,
            dueDate: dueDate || null,
            priority: priority || 'Medium',
            status: status || 'To Do',
            userId: req.userId
        });

        return res.status(201).json({
            success: true,
            message: 'Task created successfully!',
            task: newTask
        });
    } catch (err) {
        console.error('Error creating task:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to create task.'
        });
    }
};

// Update an existing task
exports.updateTask = async (req, res) => {
    const { title, description, dueDate, priority, status } = req.body;

    try {
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or unauthorized.'
            });
        }

        // Update properties if provided in body
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate || null;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;

        await task.save();

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully!',
            task
        });
    } catch (err) {
        console.error('Error updating task:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to update task.'
        });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        const deletedRows = await Task.destroy({
            where: {
                id: req.params.id,
                userId: req.userId
            }
        });

        if (deletedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Task not found or unauthorized.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully!'
        });
    } catch (err) {
        console.error('Error deleting task:', err);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete task.'
        });
    }
};
