import express from "express"
import upload from "../middleware/multer"
import categoryController from "../controller/categoryController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const categoryRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, checkUserPermisson, categoryController.getCategories)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, upload.any(), categoryController.createCategory)

    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, upload.any(), categoryController.updateCategory)

    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, categoryController.deleteCategory)

    return app.use("/category", router)
}

export default categoryRoute