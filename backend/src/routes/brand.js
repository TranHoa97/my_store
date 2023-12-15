import express from "express"
import brandController from "../controller/brandController"
import auth from "../middleware/auth"

const router = express.Router()

const brandRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, brandController.getBrands)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, brandController.createBrand)
    
    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, brandController.updateBrand)
    
    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, brandController.deleteBrand)

    return app.use("/brand", router)
}

export default brandRoute