import express from "express"
import roleController from "../controller/roleController"

const router = express.Router()

const roleRoute = (app) => {
    // GET
    router.get("/read", roleController.getAllRoles)

    // CREATE
    router.post("/create", roleController.createRole)
    
    // UPDATE
    router.put("/update", roleController.updateRole)
    
    // DELETE
    router.post("/delete", roleController.deleteRole)

    return app.use("/role", router)
}

export default roleRoute