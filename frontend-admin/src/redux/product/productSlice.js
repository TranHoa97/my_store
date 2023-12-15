import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        getProductStart: (state) => {
            state.isFetching = true
        },
        getProductSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
        },
        getProductFailed: (state) => {
            state.isFetching = false
            state.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    getProductStart, 
    getProductSuccess,
    getProductFailed,
} = productSlice.actions

export default productSlice.reducer