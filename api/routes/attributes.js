const router = require("express").Router()

const attributesController = require("../controller/attributesController")
const auth = require("../middleware/auth")

const attributesRoute = (app) => {
    // GET ATTRIBUTES BY CATEGORY
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, attributesController.getAttributes)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, attributesController.createAttributes)

    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, attributesController.updateAttributes)

    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, attributesController.deleteAttributes)


    // GET ATTRIBUTES VALUE
    router.get("/read-value", auth.checkUserJwt, auth.checkUserPermisson, attributesController.getAttributesValue)

    // CREATE ATTRIBUTES VALUE
    router.post("/create-value", auth.checkUserJwt, auth.checkUserPermisson, attributesController.createAttributesValue)

    // UPDATE ATTRIBUTES VALUE
    router.put("/update-value", auth.checkUserJwt, auth.checkUserPermisson, attributesController.updateAttributesValue)

    // DELETE ATTRIBUTES VALUE
    router.delete("/delete-value", auth.checkUserJwt, auth.checkUserPermisson, attributesController.deleteAttributesValue)

    return app.use("/attributes", router)
}

module.exports = attributesRoute