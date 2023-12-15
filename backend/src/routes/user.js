import express from "express"
import userController from "../controller/userController"
import auth from "../middleware/auth"

const router = express.Router()

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

export default userRoute