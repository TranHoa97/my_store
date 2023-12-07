const router = require("express").Router()

const storeController = require("../controller/storeController")

const storeRoute = (app) => {
    // GET ALL USERS
    router.get("/homepage", storeController.getProductsHomePage)

    router.get("/categories", storeController.getCategories)

    router.get("/attributes", storeController.getAttributes)

    router.get("/brands", storeController.getBrands)

    router.get("/collections", storeController.getProductsCollectionPage)

    router.get("/search", storeController.getProductsSearch)

    router.get("/product", storeController.getProduct)

    router.post("/order", storeController.createOrder)

    return app.use("/store", router)
}

module.exports = storeRoute