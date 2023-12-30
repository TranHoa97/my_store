import express from "express"
import authController from "../controller/authController"
import { checkUserJwt } from "../middleware/auth"

const router = express.Router()

const authRoute = (app) => {
    // REGISTER
    router.post("/register", authController.handleRegister)

    // LOGIN
    router.post("/login", authController.handleLogin)

    // LOG OUT
    router.post("/logout", authController.handleLogout)

    // UPDATE ACCOUNT
    router.post("/update", checkUserJwt, authController.updateAccount)
    
    // GET ACCOUNT
    router.get("/account", checkUserJwt, authController.getUpdateAccount)

    return app.use("/auth", router)
}

export default authRoute