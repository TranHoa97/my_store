import express from "express"

import storeController from "../controller/storeController"

const router = express.Router()

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

export default storeRoute