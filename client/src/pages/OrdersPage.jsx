// client/src/pages/OrdersPage.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchMyOrders, cancelOrder } from '../features/orderSlice.js'
import Navbar from '../components/NavBar.jsx'
import toast from 'react-hot-toast'
import { FiPackage, FiX } from 'react-icons/fi'

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-emerald-400 bg-emerald-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10' },
  shipped: { label: 'Shipped', color: 'text-yellow-400 bg-yellow-400/10' },
  delivered: { label: 'Delivered', color: 'text-emerald-400 bg-emerald-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10' },
}

export default function OrdersPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return
    const result = await dispatch(cancelOrder(id))
    if (result.meta.requestStatus === 'fulfilled') toast.success('Order cancelled')
    else toast.error(result.payload)
  }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-3xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          My orders
        </motion.h1>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No orders yet</h3>
            <p className="text-gray-600 mb-8">Start shopping to see your orders here</p>
            <button onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}>
              Explore listings
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => {
              const status = statusConfig[order.orderStatus] || statusConfig.placed
              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-2xl p-5 cursor-pointer transition-all"
                  style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(52,211,153,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                  onClick={() => navigate(`/orders/${order._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-xs text-gray-600 font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                      {order.orderStatus === 'placed' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCancel(order._id) }}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)' }}
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="flex gap-2 mb-4">
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                        style={{ background: '#1e293b' }}>
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xs text-gray-500"
                        style={{ background: '#1e293b' }}>
                        +{order.items.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      ₹{order.total.toLocaleString()}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}