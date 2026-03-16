// client/src/features/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../api/axios.js'

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, thunkAPI) => {
    try {
      const query = new URLSearchParams(params).toString()
      const { data } = await axios.get(`/products?${query}`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/products/${id}`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

export const createProduct = createAsyncThunk(
  'products/create',
  async (formData, thunkAPI) => {
    try {
      const { data } = await axios.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create listing')
    }
  }
)

export const fetchMyListings = createAsyncThunk(
  'products/myListings',
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get('/products/my-listings')
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch listings')
    }
  }
)

export const fetchRelatedProducts = createAsyncThunk(
  'products/fetchRelated',
  async (id, thunkAPI) => {
    try {
      const { data } = await axios.get(`/products/${id}/related`)
      return data
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch related products')
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/products/${id}`)
      return id
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete listing')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    myListings: [],
    relatedProducts: [],
    loading: false,
    error: null,
    totalPages: 1,
    total: 0,
    page: 1,
  },
  reducers: {
    clearProduct: (state) => { state.product = null },
    clearError: (state) => { state.error = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.totalPages = action.payload.totalPages
        state.total = action.payload.total
        state.page = action.payload.page
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchProductById.pending, (state) => { state.loading = true })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.product = action.payload })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(createProduct.pending, (state) => { state.loading = true })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false
        state.myListings.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(fetchMyListings.pending, (state) => { state.loading = true })
      .addCase(fetchMyListings.fulfilled, (state, action) => { state.loading = false; state.myListings = action.payload })
      .addCase(fetchMyListings.rejected, (state, action) => { state.loading = false; state.error = action.payload })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myListings = state.myListings.filter((p) => p._id !== action.payload)
      })

      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedProducts = action.payload
      })
  },
})

export const { clearProduct, clearError } = productSlice.actions
export default productSlice.reducer