// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { getMe } from './features/authSlice.js'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import HomePage from './pages/HomePage.jsx'
import SellerDashboardPage from './pages/SellerDashboardPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getMe())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/home" element={
        <ProtectedRoute><HomePage /></ProtectedRoute>
      } />
      <Route path="/products/:id" element={
        <ProtectedRoute><ProductDetailPage /></ProtectedRoute>
      } />
      <Route path="/seller/dashboard" element={
        <ProtectedRoute roleRequired="seller"><SellerDashboardPage /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App