// client/src/pages/OrderConfirmationPage.jsx
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchMyOrders } from '../features/orderSlice.js'
import Navbar from '../components/NavBar.jsx'
import { FiCheckCircle, FiPackage, FiMapPin, FiArrowRight } from 'react-icons/fi'

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-emerald-400' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400' },
  shipped: { label: 'Shipped', color: 'text-yellow-400' },
  delivered: { label: 'Delivered', color: 'text-emerald-400' },
  cancelled: { label: 'Cancelled', color: 'text-red-400' },
}

function OrderConfirmationSkeleton() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full skeleton-shimmer mx-auto mb-5" />
          <div className="h-8 w-48 rounded-xl skeleton-shimmer mx-auto mb-3" />
          <div className="h-4 w-32 rounded-lg skeleton-shimmer mx-auto" />
        </div>

        {/* Card skeleton */}
        <div
          className="rounded-2xl p-6 mb-4"
          style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
        >
          {/* Status row */}
          <div className="flex justify-between items-center mb-5">
            <div className="h-4 w-16 rounded skeleton-shimmer" />
            <div className="h-4 w-24 rounded skeleton-shimmer" />
          </div>

          {/* Item skeletons */}
          <div className="space-y-3 mb-5">
            {Array(2).fill(0).map((_, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-lg skeleton-shimmer flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/4 rounded skeleton-shimmer" />
                </div>
                <div className="h-4 w-16 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>

          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Totals */}
          <div className="space-y-2 mb-5">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="h-3 w-20 rounded skeleton-shimmer" />
                <div className="h-3 w-16 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>

          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Address */}
          <div className="space-y-2">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-3 rounded skeleton-shimmer" style={{ width: `${70 - i * 10}%` }} />
            ))}
          </div>
        </div>

        {/* Buttons skeleton */}
        <div className="flex gap-3">
          <div className="flex-1 h-12 rounded-xl skeleton-shimmer" />
          <div className="flex-1 h-12 rounded-xl skeleton-shimmer" />
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    if (orders.length === 0) dispatch(fetchMyOrders())
  }, [dispatch, orders.length])

  const order = orders.find((o) => o._id === id)

  if (loading || !order) return <OrderConfirmationSkeleton />

  const status = statusConfig[order.orderStatus] || statusConfig.placed

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-2xl mx-auto">

        {/* Success header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 20 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: 'rgba(52,211,153,0.12)', border: '0.5px solid rgba(52,211,153,0.25)' }}
          >
            <FiCheckCircle size={36} className="text-emerald-400" />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white mb-2">Order placed!</h1>
          <p className="text-gray-500">
            Order <span className="text-emerald-400 font-mono text-sm">#{order._id.slice(-8).toUpperCase()}</span>
          </p>
        </motion.div>

        {/* Order details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-2xl p-6 mb-4"
          style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
        >
          {/* Status */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <FiPackage size={16} className="text-gray-500" />
              <span className="text-sm text-gray-400">Status</span>
            </div>
            <span className={`text-sm font-semibold ${status.color}`}>{status.label}</span>
          </div>

          {/* Items */}
          <div className="space-y-3 mb-5">
            {order.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ background: '#1e293b' }}>
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-200 truncate">{item.name}</p>
                  <p className="text-xs text-gray-600">x{item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-white">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Totals */}
          <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-white">₹{order.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-white">₹{order.shippingFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-emerald-400 font-bold text-lg">
                ₹{order.total.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.06)' }} />

          {/* Shipping address */}
          <div className="flex items-start gap-2">
            <FiMapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-400">
              <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex gap-3"
        >
          <button
            onClick={() => navigate('/orders')}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)' }}
          >
            View all orders
          </button>
          <button
            onClick={() => navigate('/home')}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
          >
            Keep shopping <FiArrowRight size={14} />
          </button>
        </motion.div>
      </div>
    </div>
  )
}