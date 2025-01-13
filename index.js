require('dotenv').config();
const sequelize = require('./config/db');
const express = require('express');
const app = require('./app');
const  cors = require('cors')


app.use(cors());

app.use(express.json());

// Tester la connexion à la base de données
sequelize.authenticate()
    .then(() => {
        console.log('Connected to the database successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

// Synchroniser les modèles
sequelize.sync()
    .then(() => console.log('Database synced'))
    .catch((err) => console.error('Failed to sync database:', err));
    
// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
