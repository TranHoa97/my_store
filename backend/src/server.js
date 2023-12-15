import express from "express"
require("dotenv").config()
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

import initRoute from "./routes"

// import connection from "./config/connectDB"

const app = express()

app.use(function(req, res, next) {
    const corsWhitelist = [
        process.env.REACT_URL_ADMIN,
        process.env.REACT_URL_CLIENT,
    ];
    if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin)
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
        res.setHeader('Access-Control-Allow-Credentials', true)
    }
    next()
});
app.use(cookieParser());

// config body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"));

// test connection
// connection();

// routes
initRoute(app)

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(">>> Sever is running!");
})