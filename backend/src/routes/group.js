import express from "express"
import groupController from "../controller/groupController"
import auth from "../middleware/auth"

const router = express.Router()

const groupRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, groupController.getGroups)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, groupController.createGroup)
    
    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, groupController.updateGroup)
    
    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, groupController.deleteGroup)

    return app.use("/group", router)
}

export default groupRoute