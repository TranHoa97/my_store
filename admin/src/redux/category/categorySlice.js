import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        getCategoryStart: (state) => {
            state.isFetching = true
        },
        getCategorySuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
        },
        getCategoryFailed: (state) => {
            state.isFetching = false
            state.error = true
        }
    },
})

// Action creators are generated for each case reducer function
export const { 
    getCategoryStart, 
    getCategorySuccess,
    getCategoryFailed
} = categorySlice.actions

export default categorySlice.reducer