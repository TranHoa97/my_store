import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    type: null,
    message: null,
    duration: null,
    open: false
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        openNotification: (state, action) => {
            state.type = action.payload.type
            state.message = action.payload.message
            state.duration = action.payload.duration
            state.open = true
        },
        closeNotification: (state) => {
            state.open = false
            state.type = null
            state.message = null
            state.duration = null
        }
    },
})

// Action creators are generated for each case reducer function
export const {
    openNotification,
    closeNotification
} = notificationSlice.actions

export default notificationSlice.reducer