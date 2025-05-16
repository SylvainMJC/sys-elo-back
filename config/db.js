require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true, // Enforce SSL
        rejectUnauthorized: false, // Allow self-signed certificates
      },
    },
  }
);

module.exports = sequelize;
