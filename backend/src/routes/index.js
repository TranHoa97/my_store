import groupRoute from "./group"
import roleRoute from "./role"
import userRoute from "./user"
import authRoute from "./auth"
import categoryRoute from "./category"
import brandRoute from "./brand"
import attributesRoute from "./attribute"
import productRoute from "./product"
import variantRoute from "./variant"
import imageRoute from "./image"
import dashboardRoute from "./dashboard"
import orderRoute from "./order"
import storeRoute from "./store"

const initRoute = (app) => {
    authRoute(app)
    groupRoute(app)
    roleRoute(app)
    userRoute(app)
    categoryRoute(app)
    brandRoute(app)
    attributesRoute(app)
    productRoute(app)
    variantRoute(app)
    imageRoute(app)
    dashboardRoute(app)
    orderRoute(app)
    storeRoute(app)
}

export default initRoute