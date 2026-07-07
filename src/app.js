const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Manager Backend Running'
    });
});

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/tasks', require('./routes/task.routes'));
app.use('/api/ai', require('./routes/ai.routes'));

module.exports = app;