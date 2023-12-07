import { createSlice } from '@reduxjs/toolkit'

const items = localStorage.getItem('cartItems') !== null ? JSON.parse(localStorage.getItem('cartItems')) : []

const initialState = {
    value: items,
}

export const cartItemsSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        addItem: (state, action) => {
            let newItem = action.payload
            let duplicate = state.value.filter(item => item.variants_id === newItem.variants_id && item.color.title === newItem.color.title)
            if(duplicate.length > 0) {
                state.value = state.value.map(item => {
                    if(item.id === newItem.id && item.color.title === newItem.color.title) {
                        return {...item, quantity: newItem.quantity + duplicate[0].quantity}
                    } else {
                        return {...item}
                    }
                })
            }else {
                state.value.push(newItem)
            }
            localStorage.setItem('cartItems', JSON.stringify(state.value))
        },

        updateItem: (state, action) => {
            let newItem = action.payload
            let items = state.value.filter(item => item.variants_id === newItem.variants_id)
            if(items.length > 0) {
                state.value = state.value.map(item => {
                    if(item.id === newItem.id && item.color.title === newItem.color.title) {
                        return {...item, quantity: newItem.quantity}
                    } else {
                        return {...item}
                    }
                })
            }
            localStorage.setItem('cartItems', JSON.stringify(state.value))
        },

        removeItem: (state, action) => {
            const item = action.payload
            state.value = state.value.filter(e => {
                if(e.variants_id !== item.variants_id) {
                    return e
                }
                if(e.variants_id === item.variants_id && e.color.title !== item.color.title) {
                    return e
                }
            })
            localStorage.setItem('cartItems', JSON.stringify(state.value))
        },

        clearItem: (state) => {
            localStorage.removeItem('cartItems')
            state.value = []
        },
    },
})

// Action creators are generated for each case reducer function
export const { addItem, removeItem, updateItem, clearItem } = cartItemsSlice.actions

export default cartItemsSlice.reducer