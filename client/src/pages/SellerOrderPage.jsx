// client/src/pages/SellerOrdersPage.jsx
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchSellerOrders, updateOrderStatus } from '../features/orderSlice.js'
import Navbar from '../components/NavBar.jsx'
import toast from 'react-hot-toast'
import { FiPackage, FiChevronDown, FiUser, FiMapPin } from 'react-icons/fi'

const statusConfig = {
  placed: { label: 'Order Placed', color: 'text-emerald-400 bg-emerald-400/10' },
  confirmed: { label: 'Confirmed', color: 'text-blue-400 bg-blue-400/10' },
  shipped: { label: 'Shipped', color: 'text-yellow-400 bg-yellow-400/10' },
  delivered: { label: 'Delivered', color: 'text-green-400 bg-green-400/10' },
  cancelled: { label: 'Cancelled', color: 'text-red-400 bg-red-400/10' },
}

const nextStatus = {
  placed: 'confirmed',
  confirmed: 'shipped',
  shipped: 'delivered',
}

const nextStatusLabel = {
  placed: 'Confirm Order',
  confirmed: 'Mark Shipped',
  shipped: 'Mark Delivered',
}

export default function SellerOrdersPage() {
  const dispatch = useDispatch()
  const { sellerOrders, loading } = useSelector((state) => state.orders)
  const [expandedOrder, setExpandedOrder] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => { dispatch(fetchSellerOrders()) }, [dispatch])

  const handleStatusUpdate = async (orderId, currentStatus) => {
    const next = nextStatus[currentStatus]
    if (!next) return

    setUpdatingId(orderId)
    const result = await dispatch(updateOrderStatus({ id: orderId, orderStatus: next }))
    setUpdatingId(null)

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success(`Order marked as ${next}!`)
    } else {
      toast.error(result.payload || 'Failed to update')
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-white">Customer Orders</h1>
            <p className="text-gray-500 mt-1">{sellerOrders.length} orders received</p>
          </div>
        </motion.div>

        {loading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl skeleton-shimmer" />
            ))}
          </div>
        ) : sellerOrders.length === 0 ? (
          <div className="text-center py-24">
            <FiPackage size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No orders yet</h3>
            <p className="text-gray-600">Orders from buyers will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sellerOrders.map((order, index) => {
              const status = statusConfig[order.orderStatus] || statusConfig.placed
              const isExpanded = expandedOrder === order._id
              const canUpdate = nextStatus[order.orderStatus]

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
                >
                  {/* Order header */}
                  <div
                    className="p-5 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {/* Buyer avatar */}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#059669,#0891b2)' }}>
                          {order.buyer?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{order.buyer?.name}</p>
                          <p className="text-xs text-gray-600 font-mono">
                            #{order._id.slice(-8).toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                          {status.label}
                        </span>
                        <FiChevronDown
                          size={16}
                          className="text-gray-500 transition-transform"
                          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                        />
                      </div>
                    </div>

                    {/* Items preview + total */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                            style={{ background: '#1e293b' }}>
                            {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs text-gray-500"
                            style={{ background: '#1e293b' }}>
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-400 font-bold">₹{order.total.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="p-5 space-y-5">

                          {/* Order items */}
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">Items</p>
                            <div className="space-y-3">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex gap-3 items-center">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                                    style={{ background: '#1e293b' }}>
                                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover" />}
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
                          </div>

                          {/* Shipping address */}
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wider mb-3">
                              Ship to
                            </p>
                            <div className="flex items-start gap-2 p-3 rounded-xl"
                              style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}>
                              <FiMapPin size={14} className="text-gray-500 mt-0.5 flex-shrink-0" />
                              <div className="text-sm text-gray-400">
                                <p className="text-white font-medium">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.addressLine1}</p>
                                {order.shippingAddress.addressLine2 && (
                                  <p>{order.shippingAddress.addressLine2}</p>
                                )}
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pincode}</p>
                                <p className="text-emerald-400 mt-1">{order.shippingAddress.phone}</p>
                              </div>
                            </div>
                          </div>

                          {/* Price breakdown */}
                          <div className="space-y-2">
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
                              <span className="text-emerald-400 font-bold">₹{order.total.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Update status button */}
                          {canUpdate && order.orderStatus !== 'cancelled' && (
                            <motion.button
                              whileTap={{ scale: 0.97 }}
                              onClick={() => handleStatusUpdate(order._id, order.orderStatus)}
                              disabled={updatingId === order._id}
                              className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50"
                              style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
                              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.3)'}
                              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                              {updatingId === order._id
                                ? 'Updating...'
                                : nextStatusLabel[order.orderStatus]
                              }
                            </motion.button>
                          )}

                          {order.orderStatus === 'delivered' && (
                            <div className="text-center py-3 text-sm text-emerald-400 font-medium">
                              ✓ Order completed
                            </div>
                          )}

                          {order.orderStatus === 'cancelled' && (
                            <div className="text-center py-3 text-sm text-red-400 font-medium">
                              This order was cancelled
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}