const router = require("express").Router()
const upload = require("../middleware/multer")

const imageController = require("../controller/imageController")
const auth = require("../middleware/auth")

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

module.exports = imageRoute