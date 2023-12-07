const router = require("express").Router()

const dashboardController = require("../controller/dashboardController")
const auth = require("../middleware/auth")

const dashboardRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, dashboardController.getDataDashboard)

    router.get("/recent-orders", auth.checkUserJwt, dashboardController.getRecentOrders)

    return app.use("/dashboard", router)
}

module.exports = dashboardRoute