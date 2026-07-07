const { Sequelize } = require('sequelize');
const { Client } = require('pg');

const dbName = process.env.DB_NAME || 'task_manager_db';
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || 'postgres';
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;

// Auto-create database if it doesn't exist (skips in production)
async function ensureDatabaseExists() {
    // Render databases are pre-created by the host, so we skip auto-creation in production.
    if (process.env.NODE_ENV === 'production') {
        console.log('📦 Production environment detected. Skipping database creation.');
        return;
    }

    const client = new Client({
        user: dbUser,
        password: dbPassword,
        host: dbHost,
        port: dbPort,
        database: 'postgres' // Connect to default database first
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" does not exist. Creating...`);
            await client.query(`CREATE DATABASE "${dbName}"`);
            console.log(`Database "${dbName}" created successfully!`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error verifying/creating database:', err.message);
    } finally {
        try {
            await client.end();
        } catch (e) {
            // Ignore error on close
        }
    }
}

// Detect production to apply SSL requirements for remote databases
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false,
    dialectOptions: isProduction ? {
        ssl: {
            require: true,
            rejectUnauthorized: false // Required for hosted DBs (like Render/Supabase)
        }
    } : {},
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = {
    sequelize,
    ensureDatabaseExists
};