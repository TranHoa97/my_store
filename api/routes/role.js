const router = require("express").Router()

const roleController = require("../controller/roleController")
const auth = require("../middleware/auth")

const roleRoute = (app) => {
    // GET
    router.get("/read",  roleController.getAllRoles)

    // CREATE
    router.post("/create", roleController.createRole)
    
    // UPDATE
    router.put("/update", roleController.updateRole)
    
    // DELETE
    router.post("/delete", roleController.deleteRole)

    return app.use("/role", router)
}

module.exports = roleRoute