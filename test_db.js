const { Client } = require("pg");

console.log(process.env.DB_USER);
console.log(process.env.DB_NAME);
console.log(process.env.DB_PASSWORD);
console.log(process.env.DB_HOST);

const client = new Client({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
});

client
  .connect()
  .then(() => {
    console.log("Connected to the database!");
    return client.end();
  })
  .catch((err) => {
    console.error("Connection error:", err.stack);
  });
