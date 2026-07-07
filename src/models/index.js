const { sequelize, ensureDatabaseExists } = require('../config/db.config');
const User = require('./User');
const Task = require('./Task');

// Associations
User.hasMany(Task, {
    foreignKey: 'userId',
    as: 'tasks',
    onDelete: 'CASCADE'
});

Task.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

module.exports = {
    sequelize,
    ensureDatabaseExists,
    User,
    Task
};
