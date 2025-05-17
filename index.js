require("dotenv").config();
const sequelize = require("./config/db");
const express = require("express");
const app = require("./app");
const redisClient = require("./config/redis");

app.use(express.json());

//Connexion a Redis
(async () => {
  try {
    await redisClient.connect();
    await redisClient.set("test", "redis-ok");
    const result = await redisClient.get("test");
    console.log("Redis test result:", result); 
  } catch (error) {
    console.error("Redis connection error:", error);
  }
})();

// Tester la connexion à la base de données
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Synchroniser les modèles
sequelize
  .sync()
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Failed to sync database:", err));

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
