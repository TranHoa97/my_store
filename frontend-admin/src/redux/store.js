import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import menuSliderReducer from "./slice/menuSiderSlice"
import notificationReducer from "./slice/notificationSlice"

import authReducer from "./auth/authSlice"
import productReducer from "./product/productSlice"
import variantsReducer from "./variants/variantsSlice"
import orderReducer from "./order/orderSlice"
import attributesReducer from "./attributes/attributesSlice"
import brandReducer from "./brand/brandSlice"
import categoryReducer from "./category/categorySlice"
import groupReducer from "./group/groupSlice"
import userReducer from "./user/userSlice"
import rolesReducer from "./roles/roleSlice"
import imageReducer from "./image/imageSlice"

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}

const rootReducer = combineReducers({
    brand: brandReducer,
    category: categoryReducer,
    auth: authReducer,
    menu: menuSliderReducer,
    user: userReducer,
    group: groupReducer,
    attributes: attributesReducer,
    product: productReducer,
    variants: variantsReducer,
    order: orderReducer,
    notification: notificationReducer,
    roles: rolesReducer,
    image: imageReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
})

export let persistor = persistStore(store)