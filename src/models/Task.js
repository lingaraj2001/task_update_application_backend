const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db.config');

const Task = sequelize.define('Task', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        defaultValue: 'Medium',
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('To Do', 'In Progress', 'Done'),
        defaultValue: 'To Do',
        allowNull: false
    }
}, {
    timestamps: true
});

module.exports = Task;
