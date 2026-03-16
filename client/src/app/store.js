// client/src/app/store.js
import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/authSlice.js'
import productReducer from '../features/productSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
  },
})