import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const imageSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {
        getImageStart: (state) => {
            state.isFetching = true
        },
        getImageSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
            state.error = false
        },
        getImageFailed: (state) => {
            state.isFetching = false
            state.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    getImageStart, 
    getImageSuccess,
    getImageFailed
} = imageSlice.actions

export default imageSlice.reducer