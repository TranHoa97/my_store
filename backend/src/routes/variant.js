import express from "express"
import variantsController from "../controller/variantController"
import auth from "../middleware/auth"

const router = express.Router()

const variantRoute = (app) => {
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

export default variantRoute