// client/src/pages/CartPage.jsx
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { removeFromCart, updateQuantity, clearCart } from '../features/cartSlice.js'
import Navbar from '../components/NavBar.jsx'
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi'

export default function CartPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = items.length > 0 ? 99 : 0
  const total = subtotal + shippingFee

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-6xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Your cart
          <span className="text-gray-600 text-lg font-normal ml-3">
            {items.length} {items.length === 1 ? 'item' : 'items'}
          </span>
        </motion.h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <FiShoppingBag size={48} className="text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-8">Add some items to get started</p>
            <button
              onClick={() => navigate('/home')}
              className="px-6 py-3 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
            >
              Explore listings
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-4 p-4 rounded-2xl"
                    style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.06)' }}
                  >
                    {/* Image */}
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0"
                      style={{ background: '#1e293b' }}>
                      {item.image && (
                        <img src={item.image} alt={item.name}
                          className="w-full h-full object-cover" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-white truncate">{item.name}</h3>
                      <p className="text-emerald-400 font-bold mt-1">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      )}

                      {/* Quantity controls */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-2 rounded-full px-2 py-1"
                          style={{ background: '#1e293b', border: '0.5px solid rgba(255,255,255,0.08)' }}>
                          <button
                            onClick={() => {
                              if (item.quantity === 1) dispatch(removeFromCart(item.product))
                              else dispatch(updateQuantity({ product: item.product, quantity: item.quantity - 1 }))
                            }}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="text-sm font-medium text-white w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(updateQuantity({ product: item.product, quantity: item.quantity + 1 }))}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => dispatch(removeFromCart(item.product))}
                          className="text-gray-600 hover:text-red-400 transition-colors"
                        >
                          <FiTrash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Clear cart */}
              <button
                onClick={() => dispatch(clearCart())}
                className="text-sm text-gray-600 hover:text-red-400 transition-colors"
              >
                Clear cart
              </button>
            </div>

            {/* Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 h-fit sticky top-24"
              style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-lg font-bold text-white mb-6">Order summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-white">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-white">₹{shippingFee}</span>
                </div>
                <div className="h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-emerald-400 font-bold text-lg">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/checkout')}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.35)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                Proceed to checkout <FiArrowRight size={16} />
              </motion.button>

              <p className="text-xs text-gray-600 text-center mt-4">
                Free returns · Secure checkout
              </p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}