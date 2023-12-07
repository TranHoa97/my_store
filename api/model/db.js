const mysql = require('mysql2');
const dotenv = require("dotenv");
dotenv.config();

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: process.env.PASSWORD_DATABASE,
    database: "my_store"
});

module.exports = db.promise()