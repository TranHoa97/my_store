import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const variantsSlice = createSlice({
    name: 'variants',
    initialState,
    reducers: {
        getVariantsStart: (state) => {
            state.isFetching = true
        },
        getVariantsSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
            state.error = false
        },
        getVariantsFailed: (state) => {
            state.isFetching = false
            state.error = true
        },

    },
})

// Action creators are generated for each case reducer function
export const {
    getVariantsStart, 
    getVariantsSuccess,
    getVariantsFailed,
} = variantsSlice.actions

export default variantsSlice.reducer