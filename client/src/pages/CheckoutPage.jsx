// client/src/pages/CheckoutPage.jsx
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { placeOrder } from '../features/orderSlice.js'
import { clearCart } from '../features/cartSlice.js'
import Navbar from '../components/NavBar.jsx'
import toast from 'react-hot-toast'
import { FiMapPin, FiCreditCard, FiTruck, FiCheck } from 'react-icons/fi'

const INITIAL_ADDRESS = {
  fullName: '', phone: '', addressLine1: '',
  addressLine2: '', city: '', state: '', pincode: '',
}

export default function CheckoutPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items } = useSelector((state) => state.cart)
  const { loading } = useSelector((state) => state.orders)
  const [address, setAddress] = useState(INITIAL_ADDRESS)
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  const shippingFee = 99
  const total = subtotal + shippingFee

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    const orderData = {
      items: items.map((item) => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        seller: item.seller,
      })),
      shippingAddress: address,
      paymentMethod,
    }

    const result = await dispatch(placeOrder(orderData))
    if (result.meta.requestStatus === 'fulfilled') {
      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate(`/orders/${result.payload._id}`)
    } else {
      toast.error(result.payload || 'Failed to place order')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
  const inputStyle = {
    background: '#1e293b',
    border: '0.5px solid rgba(255,255,255,0.08)',
  }
  const inputFocus = (e) => e.target.style.borderColor = 'rgba(52,211,153,0.4)'
  const inputBlur = (e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <Navbar />
      <div className="pt-24 px-6 md:px-10 pb-20 max-w-6xl mx-auto">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-8"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left — Address + Payment */}
            <div className="lg:col-span-2 space-y-6">

              {/* Shipping address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-6"
                style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <FiMapPin size={16} className="text-emerald-400" />
                  <h2 className="text-base font-semibold text-white">Shipping address</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Full name *</label>
                      <input name="fullName" value={address.fullName} onChange={handleChange}
                        required placeholder="John Doe" className={inputClass} style={inputStyle}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Phone *</label>
                      <input name="phone" value={address.phone} onChange={handleChange}
                        required placeholder="9876543210" className={inputClass} style={inputStyle}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Address line 1 *</label>
                    <input name="addressLine1" value={address.addressLine1} onChange={handleChange}
                      required placeholder="House no, Street name" className={inputClass} style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} />
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Address line 2</label>
                    <input name="addressLine2" value={address.addressLine2} onChange={handleChange}
                      placeholder="Landmark, Area (optional)" className={inputClass} style={inputStyle}
                      onFocus={inputFocus} onBlur={inputBlur} />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">City *</label>
                      <input name="city" value={address.city} onChange={handleChange}
                        required placeholder="Chennai" className={inputClass} style={inputStyle}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">State *</label>
                      <input name="state" value={address.state} onChange={handleChange}
                        required placeholder="Tamil Nadu" className={inputClass} style={inputStyle}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1.5 block">Pincode *</label>
                      <input name="pincode" value={address.pincode} onChange={handleChange}
                        required placeholder="600001" className={inputClass} style={inputStyle}
                        onFocus={inputFocus} onBlur={inputBlur} />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl p-6"
                style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <FiCreditCard size={16} className="text-emerald-400" />
                  <h2 className="text-base font-semibold text-white">Payment method</h2>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: <FiTruck size={18} />, desc: 'Pay when delivered' },
                    { value: 'online', label: 'Online Payment', icon: <FiCreditCard size={18} />, desc: 'UPI, Card, NetBanking' },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() => setPaymentMethod(method.value)}
                      className="flex flex-col items-start gap-2 p-4 rounded-xl transition-all text-left"
                      style={{
                        background: paymentMethod === method.value ? 'rgba(52,211,153,0.08)' : 'rgba(255,255,255,0.02)',
                        border: paymentMethod === method.value ? '0.5px solid rgba(52,211,153,0.35)' : '0.5px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <div className={paymentMethod === method.value ? 'text-emerald-400' : 'text-gray-500'}>
                        {method.icon}
                      </div>
                      <div>
                        <div className={`text-sm font-semibold ${paymentMethod === method.value ? 'text-emerald-400' : 'text-gray-300'}`}>
                          {method.label}
                        </div>
                        <div className="text-xs text-gray-600 mt-0.5">{method.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right — Order summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl p-6 h-fit sticky top-24"
              style={{ background: '#0f172a', border: '0.5px solid rgba(255,255,255,0.07)' }}
            >
              <h2 className="text-lg font-bold text-white mb-5">Order summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.product} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0"
                      style={{ background: '#1e293b' }}>
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-300 truncate">{item.name}</p>
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
              <div className="space-y-2 mb-6">
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
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg,#059669,#047857)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(5,150,105,0.35)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {loading ? 'Placing order...' : (
                  <><FiCheck size={16} /> Place order</>
                )}
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}