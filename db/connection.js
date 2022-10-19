const mysql = require("mysql2");

require("dotenv").config();

// The db connection that takes in the username and password through a .env file
const db = mysql
  .createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: "employees",
  })
  .promise();

module.exports = db;
