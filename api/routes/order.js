const router = require("express").Router()

const orderController = require("../controller/orderController")
const auth = require("../middleware/auth")

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

module.exports = orderRoute