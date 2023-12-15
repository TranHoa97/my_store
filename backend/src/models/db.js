import mysql from "mysql2"
require("dotenv").config()

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE_NAME,
    port: process.env.DB_PORT
}).promise();

export default db