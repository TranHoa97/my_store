const router = require("express").Router()
const upload = require("../middleware/multer")

const productController = require("../controller/productController")
const auth = require("../middleware/auth")

const productRoute = (app) => {
    // GET ALL PRODUCTS
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, productController.getProducts)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, upload.any(), productController.createProudct)

    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, upload.any(), productController.updateProudct)

    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, productController.deleteProudct)

    return app.use("/products", router)
}

module.exports = productRoute