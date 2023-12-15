import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const groupSlice = createSlice({
    name: 'group',
    initialState,
    reducers: {
        // Get User
        getGroupStart: (state) => {
            state.isFetching = true
        },
        getGroupSuccess: (state, action) => {
            state.isFetching = false
            state.error = false
            state.value = action.payload
        },
        getGroupFailed: (state, action) => {
            state.isFetching = false
            state.error = true
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    getGroupStart,
    getGroupSuccess,
    getGroupFailed,
} = groupSlice.actions

export default groupSlice.reducer