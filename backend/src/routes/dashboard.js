import express from "express"
import dashboardController from "../controller/dashboardController"
import auth from "../middleware/auth"

const router = express.Router()

const dashboardRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, dashboardController.getDataDashboard)

    router.get("/recent-orders", auth.checkUserJwt, dashboardController.getRecentOrders)

    return app.use("/dashboard", router)
}

export default dashboardRoute