import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    attributes: {
        isFetching: false,
        value: null,
        error: false,
    },
    value: {
        isFetching: false,
        value: null,
        error: false,
    }
}

export const attributesSlice = createSlice({
    name: 'attributes',
    initialState,
    reducers: {
        // Get Attributes
        getAttributesStart: (state) => {
            state.attributes.isFetching = true
        },
        getAttributesSuccess: (state, action) => {
            state.attributes.isFetching = false
            state.attributes.value = action.payload
        },
        getAttributesFailed: (state) => {
            state.attributes.isFetching = false
            state.attributes.error = true
        },

        // Get Attributes Value
        getAttributesValueStart: (state) => {
            state.value.isFetching = true
        },
        getAttributesValueSuccess: (state, action) => {
            state.value.isFetching = false
            state.value.value = action.payload
        },
        getAttributesValueFailed: (state) => {
            state.value.isFetching = false
            state.value.error = true
        },
    },
})

// Action creators are generated for each case reducer function
export const { 
    getAttributesStart, 
    getAttributesSuccess,
    getAttributesFailed,
    getAttributesValueStart,
    getAttributesValueSuccess,
    getAttributesValueFailed
} = attributesSlice.actions

export default attributesSlice.reducer