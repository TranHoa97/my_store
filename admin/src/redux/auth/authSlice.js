import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: "auth",
    initialState: {
        login: {
            value: null,
            isFetching: false,
            error: false
        },
        register: {
            isFetching: false,
            error: false,
            success: false
        }
    },
    reducers: {
        loginStart: (state) => {
            state.login.isFetching = true
        },
        loginSuccess: (state, action) => {
            state.login.isFetching = false
            state.login.value = action.payload
            state.login.error = false
        },
        loginFailed: (state) => {
            state.login.isFetching = false,
            state.login.error = true
        },

        registerStart: (state) => {
            state.register.isFetching = true
        },
        registerSuccess: (state, action) => {
            state.register.isFetching = false
            state.register.success = true
            state.register.error = false
        },
        registerFailed: (state) => {
            state.register.isFetching = false,
            state.register.error = true,
            state.register.success = false
        },
    }
})

export const {
    loginStart,
    loginFailed,
    loginSuccess,
    registerStart,
    registerSuccess,
    registerFailed
} = authSlice.actions

export default authSlice.reducer

