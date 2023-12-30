import express from "express"
import orderController from "../controller/orderController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const orderRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, checkUserPermisson, orderController.getOrders)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, orderController.createOrder)
    
    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, orderController.updateOrder)
    
    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, orderController.deleteOrder)

    return app.use("/orders", router)
}

export default orderRoute