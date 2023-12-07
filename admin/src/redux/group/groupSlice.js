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
            state.value = action.payload
            state.error = false
        },
        getGroupFailed: (state) => {
            state.isFetching = false
            state.error = true
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