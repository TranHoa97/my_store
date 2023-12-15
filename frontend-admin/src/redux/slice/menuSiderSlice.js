import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: null
}

export const menuSliderSlice = createSlice({
    name: 'menuSlider',
    initialState,
    reducers: {
        setMenu: (state, action) => {
            state.value = action.payload
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    setMenu
} = menuSliderSlice.actions

export default menuSliderSlice.reducer