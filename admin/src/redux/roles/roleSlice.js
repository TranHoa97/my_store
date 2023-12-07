import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isFetching: false,
    value: null,
    error: false
}

export const userSlice = createSlice({
    name: 'roles',
    initialState,
    reducers: {
        // Get User
        getRoleStart: (state) => {
            state.isFetching = true
        },
        getRoleSuccess: (state, action) => {
            state.isFetching = false
            state.value = action.payload
            state.error = false
        },
        getRoleFailed: (state) => {
            state.isFetching = false
            state.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const {
    getRoleStart,
    getRoleSuccess,
    getRoleFailed,
} = userSlice.actions

export default userSlice.reducer