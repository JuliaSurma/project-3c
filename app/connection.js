require('dotenv').config();
console.log(process.env);


const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scheduleapp",
  password: "Maryjane4536",
  port: "5432"
});
pool.connect();

module.exports = pool