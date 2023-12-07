import { configureStore } from '@reduxjs/toolkit'

import cartItemsReducer from './cartSlice/cartItemSlice'
import categoryReducer from './category/categorySlice'

export const store = configureStore({
    reducer: {
        cartItems: cartItemsReducer,
        category: categoryReducer
    },
})