import express from "express"
import upload from "../middleware/multer"
import productController from "../controller/productController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const productRoute = (app) => {
    // GET ALL PRODUCTS
    router.get("/read", checkUserJwt, checkUserPermisson, productController.getProducts)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, upload.any(), productController.createProudct)

    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, upload.any(), productController.updateProudct)

    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, productController.deleteProudct)

    return app.use("/products", router)
}

export default productRoute