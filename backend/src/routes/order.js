import express from "express"
import orderController from "../controller/orderController"
import auth from "../middleware/auth"

const router = express.Router()

const orderRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, orderController.getOrders)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, orderController.createOrder)
    
    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, orderController.updateOrder)
    
    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, orderController.deleteOrder)

    return app.use("/orders", router)
}

export default orderRoute