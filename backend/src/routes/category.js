import express from "express"
import categoryController from "../controller/categoryController"
import auth from "../middleware/auth"

const router = express.Router()

const categoryRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, categoryController.getCategories)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, categoryController.createCategory)

    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, categoryController.updateCategory)

    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, categoryController.deleteCategory)

    return app.use("/category", router)
}

export default categoryRoute