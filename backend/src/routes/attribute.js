import express from "express"
const router = express.Router()
import attributesController from "../controller/attributeController"

import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const attributesRoute = (app) => {
    // GET ATTRIBUTES
    router.get("/read", checkUserJwt, checkUserPermisson, attributesController.getAttributes)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, attributesController.createAttributes)

    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, attributesController.updateAttributes)

    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, attributesController.deleteAttributes)


    // GET ATTRIBUTES VALUE
    router.get("/read-value", checkUserJwt, checkUserPermisson, attributesController.getAttributesValue)

    // CREATE ATTRIBUTES VALUE
    router.post("/create-value", checkUserJwt, checkUserPermisson, attributesController.createAttributesValue)

    // UPDATE ATTRIBUTES VALUE
    router.put("/update-value", checkUserJwt, checkUserPermisson, attributesController.updateAttributesValue)

    // DELETE ATTRIBUTES VALUE
    router.delete("/delete-value", checkUserJwt, checkUserPermisson, attributesController.deleteAttributesValue)

    return app.use("/attributes", router)
}

export default attributesRoute