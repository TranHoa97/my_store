import express from "express"
import variantsController from "../controller/variantController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const variantRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, checkUserPermisson, variantsController.getVariants)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, variantsController.createVariants)
    
    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, variantsController.updateVariants)
    
    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, variantsController.deleteVariants)

    return app.use("/variants", router)
}

export default variantRoute