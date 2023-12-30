import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const brandSlice = createSlice({
    name: 'brand',
    initialState,
    reducers: {
        getBrandStart: (state) => {
            state.isFetching = true
        },
        getBrandSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
            state.error = false
        },
        getBrandFailed: (state) => {
            state.isFetching = false
            state.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    getBrandStart, 
    getBrandSuccess,
    getBrandFailed,
} = brandSlice.actions

export default brandSlice.reducer