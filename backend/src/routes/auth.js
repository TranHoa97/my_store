import express from "express"
import authController from "../controller/authController"
import auth from "../middleware/auth"

const router = express.Router()

const authRoute = (app) => {
    // REGISTER
    router.post("/register", authController.handleRegister)

    // LOGIN
    router.post("/login", authController.handleLogin)

    // LOG OUT
    router.post("/logout", authController.handleLogout)

    // UPDATE ACCOUNT
    router.post("/update", auth.checkUserJwt, authController.updateAccount)
    
    // GET ACCOUNT
    router.get("/account", auth.checkUserJwt, authController.getUpdateAccount)

    return app.use("/auth", router)
}

export default authRoute