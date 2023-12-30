import express from "express"
import brandController from "../controller/brandController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const brandRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, checkUserPermisson, brandController.getBrands)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, brandController.createBrand)
    
    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, brandController.updateBrand)
    
    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, brandController.deleteBrand)

    return app.use("/brand", router)
}

export default brandRoute