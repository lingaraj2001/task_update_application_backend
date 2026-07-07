// const { Sequelize } = require('sequelize');
// const { Client } = require('pg');

// const dbName = process.env.DB_NAME || 'task_manager_db';
// const dbUser = process.env.DB_USER || 'postgres';
// const dbPassword = process.env.DB_PASSWORD || 'postgres';
// const dbHost = process.env.DB_HOST || 'localhost';
// const dbPort = process.env.DB_PORT || 5432;

// Auto-create database if it doesn't exist
// async function ensureDatabaseExists() {
//     const client = new Client({
//         user: dbUser,
//         password: dbPassword,
//         host: dbHost,
//         port: dbPort,
//         database: 'postgres' // Connect to default database
//     });

//     try {
//         await client.connect();
//         const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);
//         if (res.rowCount === 0) {
//             console.log(`Database "${dbName}" does not exist. Creating...`);
//             await client.query(`CREATE DATABASE "${dbName}"`);
//             console.log(`Database "${dbName}" created successfully!`);
//         } else {
//             console.log(`Database "${dbName}" already exists.`);
//         }
//     } catch (err) {
//         console.error('Error verifying/creating database:', err.message);
//         // Do not crash the application, try to let Sequelize connect anyway
//     } finally {
//         try {
//             await client.end();
//         } catch (e) {
//             // Ignore error on close
//         }
//     }
// }

// Sequelize instance placeholder
// const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
//     host: dbHost,
//     port: dbPort,
//     dialect: 'postgres',
//     logging: false,
//     pool: {
//         max: 5,
//         min: 0,
//         acquire: 30000,
//         idle: 10000
//     }
// });

// module.exports = {
//     sequelize,
//     ensureDatabaseExists
// };

async function ensureDatabaseExists() {

    if (process.env.NODE_ENV === 'production') {
        console.log('Production environment detected. Skipping database creation.');
        return;
    }

    // Existing code...
}


const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// module.exports = sequelize;