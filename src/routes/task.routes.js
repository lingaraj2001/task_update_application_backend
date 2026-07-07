const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../utils/auth.middleware');

// Protect all routes in this router
router.use(authMiddleware);

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
