// client/src/features/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios.js'

export const placeOrder = createAsyncThunk(
  'orders/place',
  async (orderData, thunkAPI) => {
    try {
      const { data } = await axios.post('/orders', orderData)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to place order')
    }
  }
)

export const fetchMyOrders = createAsyncThunk(
  'orders/myOrders',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/orders/my-orders')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.put(`/orders/${id}/cancel`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to cancel order')
    }
  }
)

export const fetchSellerOrders = createAsyncThunk(
  'orders/sellerOrders',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/orders/seller-orders')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ id, orderStatus }, thunkAPI) => {
    try {
      const { data } = await axios.put(`/orders/${id}/status`, { orderStatus })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update status')
    }
  }
)
const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    sellerOrders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload
        state.orders.unshift(action.payload)
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((o) => o._id === action.payload._id)
        if (index !== -1) state.orders[index] = action.payload
      })
      .addCase(fetchSellerOrders.pending, (state) => { state.loading = true })
  .addCase(fetchSellerOrders.fulfilled, (state, action) => {
    state.loading = false
    state.sellerOrders = action.payload
    })
  .addCase(fetchSellerOrders.rejected, (state, action) => {
    state.loading = false
    state.error = action.payload
    })
  .addCase(updateOrderStatus.fulfilled, (state, action) => {
    const index = state.sellerOrders.findIndex((o) => o._id === action.payload._id)
    if (index !== -1) state.sellerOrders[index] = action.payload
    })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer