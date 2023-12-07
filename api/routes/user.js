const router = require("express").Router()

const userController = require("../controller/userController")
const auth = require("../middleware/auth")

const userRoute = (app) => {
    // GET ALL USERS
    router.get("/read", auth.checkUserJwt, auth.checkUserPermisson, userController.getUsers)

    // CREATE
    router.post("/create", auth.checkUserJwt, auth.checkUserPermisson, userController.createUser)

    // UPDATE
    router.put("/update", auth.checkUserJwt, auth.checkUserPermisson, userController.updateUser)

    // DELETE
    router.delete("/delete", auth.checkUserJwt, auth.checkUserPermisson, userController.deleteUser)

    return app.use("/user", router)
}

module.exports = userRoute