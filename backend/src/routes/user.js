import express from "express"
import userController from "../controller/userController"
import { checkUserJwt, checkUserPermisson } from "../middleware/auth"

const router = express.Router()

const userRoute = (app) => {
    // GET ALL USERS
    router.get("/read", checkUserJwt, checkUserPermisson, userController.getUsers)

    // CREATE
    router.post("/create", checkUserJwt, checkUserPermisson, userController.createUser)

    // UPDATE
    router.put("/update", checkUserJwt, checkUserPermisson, userController.updateUser)

    // DELETE
    router.delete("/delete", checkUserJwt, checkUserPermisson, userController.deleteUser)

    return app.use("/user", router)
}

export default userRoute