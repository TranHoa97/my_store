import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        getOrderStart: (state) => {
            state.isFetching = true
        },
        getOrderSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
        },
        getOrderFailed: (state) => {
            state.isFetching = false
            state.error = true
        },

    },
})

// Action creators are generated for each case reducer function
export const {
    getOrderStart, 
    getOrderSuccess,
    getOrderFailed,
} = orderSlice.actions

export default orderSlice.reducer