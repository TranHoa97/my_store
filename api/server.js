const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors")
const dotenv = require("dotenv");
dotenv.config();

const userRoute = require("./routes/user")
const groupRoute = require("./routes/group")
const roleRoute = require("./routes/role")
const categoryRoute = require("./routes/category")
const brandRoute = require("./routes/brand")
const attributesRoute = require("./routes/attributes")
const productRoute = require("./routes/product")
const variantsRoute = require("./routes/variants")
const orderRoute = require("./routes/order")
const authRoute = require("./routes/auth")
const imageRoute = require("./routes/image")
const dashboardRoute = require("./routes/dashboard")
const storeRoute = require("./routes/store")

const app = express();
const port = process.env.PORT || 8000;

app.use(function(req, res, next) {
    const corsWhitelist = [
        process.env.REACT_URL_CLIENT,
        process.env.REACT_URL_ADMIN,
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
userRoute(app)
groupRoute(app)
roleRoute(app)
categoryRoute(app)
brandRoute(app)
attributesRoute(app)
productRoute(app)
variantsRoute(app)
orderRoute(app)
authRoute(app)
imageRoute(app)
dashboardRoute(app)
storeRoute(app)

app.listen(port, () => {
    console.log("Sever is running...");
})