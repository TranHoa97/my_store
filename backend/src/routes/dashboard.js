import express from "express"
import dashboardController from "../controller/dashboardController"
import { checkUserJwt } from "../middleware/auth"

const router = express.Router()

const dashboardRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, dashboardController.getDataDashboard)

    router.get("/recent-orders", checkUserJwt, dashboardController.getRecentOrders)

    return app.use("/dashboard", router)
}

export default dashboardRoute