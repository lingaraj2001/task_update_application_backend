require('dotenv').config();

const app = require('./app');
const { sequelize, ensureDatabaseExists } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        // 1. Ensure database is created if not exists
        await ensureDatabaseExists();

        // 2. Validate connection and sync database models
        await sequelize.authenticate();
        console.log('📦 Database connection has been established successfully.');
        
        await sequelize.sync({ force: false }); // force: false avoids dropping tables on restart
        console.log('📦 Database models synchronized.');

        // 3. Bind port
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Unable to connect to the database or start server:', error);
        process.exit(1);
    }
}

startServer();
