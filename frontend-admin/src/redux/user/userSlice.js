import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        // Get User
        getUserStart: (state) => {
            state.isFetching = true
        },
        getUserSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
            state.error = false
        },
        getUserFailed: (state) => {
            state.isFetching = false
            state.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    getUserStart,
    getUserSuccess,
    getUserFailed,
} = userSlice.actions

export default userSlice.reducer