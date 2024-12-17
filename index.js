require('dotenv').config();
const express = require('express');
const { Sequelize } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

// Configuration Sequelize avec PostgreSQL
const sequelize = new Sequelize(
    process.env.DB_NAME,       
    process.env.DB_USER,       
    process.env.DB_PASSWORD,   
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: false, 
    }
);

// Tester la connexion Sequelize
async function testDatabaseConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to the PostgreSQL database has been established successfully.');
        } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testDatabaseConnection();

// Route principale
app.get('/', (req, res) => {
    res.send('Hello, Express with Sequelize and PostgreSQL!');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
