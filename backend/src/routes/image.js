import express from "express"
import upload from "../middleware/multer"
import imageController from "../controller/imageController"
import auth from "../middleware/auth"

const router = express.Router()

const imageRoute = (app) => {
    // GET ALL PRODUCTS
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, imageController.getImages)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, upload.any(), imageController.createImage)

    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, upload.any(), imageController.updateImage)

    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, imageController.deleteImage)

    return app.use("/images", router)
}

export default imageRoute