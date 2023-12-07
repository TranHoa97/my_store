const router = require("express").Router()

const groupController = require("../controller/groupController")
const auth = require("../middleware/auth")

const groupRoute = (app) => {
    // GET
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, groupController.getGroups)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson,  groupController.createGroup)
    
    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, groupController.updateGroup)
    
    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, groupController.deleteGroup)

    return app.use("/group", router)
}

module.exports = groupRoute