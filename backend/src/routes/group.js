import express from "express"
import groupController from "../controller/groupController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const groupRoute = (app) => {
    // GET
    router.get("/read", checkUserJwt, checkUserPermisson, groupController.getGroups)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, groupController.createGroup)
    
    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, groupController.updateGroup)
    
    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, groupController.deleteGroup)

    return app.use("/group", router)
}

export default groupRoute