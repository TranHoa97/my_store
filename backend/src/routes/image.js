import express from "express"
import upload from "../middleware/multer"
import imageController from "../controller/imageController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const imageRoute = (app) => {
    // GET ALL PRODUCTS
    router.get("/read", checkUserJwt, checkUserPermisson, imageController.getImages)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, upload.any(), imageController.createImage)

    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, upload.any(), imageController.updateImage)

    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, imageController.deleteImage)

    return app.use("/images", router)
}

export default imageRoute