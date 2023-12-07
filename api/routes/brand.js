const router = require("express").Router()

const brandController = require("../controller/brandController")
const auth = require("../middleware/auth")

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

module.exports = brandRoute