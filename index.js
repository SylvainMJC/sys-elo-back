require('dotenv').config();
const express = require('express');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 3000;

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

// Middleware pour parser le corps des requêtes
app.use(express.json());

// Utiliser les routes
app.use('/api', routes);

// Route principale
app.get('/', (req, res) => {
    res.send('Hello, Express with Sequelize and PostgreSQL!');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// Synchroniser les modèles avec la base de données
sequelize.sync({ force: false }).then(() => {
    console.log('Database synchronized');
});
