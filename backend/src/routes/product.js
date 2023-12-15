import express from "express"
import upload from "../middleware/multer"
import productController from "../controller/productController"
import auth from "../middleware/auth"

const router = express.Router()

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

export default productRoute