const router = require("express").Router()

const variantsController = require("../controller/variantsController")
const auth = require("../middleware/auth")

const variantsRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, variantsController.getVariants)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, variantsController.createVariants)
    
    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, variantsController.updateVariants)
    
    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, variantsController.deleteVariants)

    return app.use("/variants", router)
}

module.exports = variantsRoute