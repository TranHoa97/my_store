const router = require("express").Router()

const authController = require("../controller/authController")
const auth = require("../middleware/auth")

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

module.exports = authRoute