// client/src/pages/RegisterPage.jsx
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { registerUser, clearError } from '../features/authSlice.js'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, loading, error } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer',
    shopName: '',
  })

  useEffect(() => {
    if (user) {
      navigate(user.role === 'seller' ? '/seller/dashboard' : '/home')
    }
  }, [user, navigate])

  useEffect(() => {
    if (error) {
      toast.error(error)
      dispatch(clearError())
    }
  }, [error, dispatch])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(registerUser(form))
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-800"
      >
        <h1 className="text-3xl font-bold text-emerald-400 mb-2">Join Thriftly</h1>
        <p className="text-gray-400 mb-8">Create your account</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-emerald-500 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-emerald-500 transition"
            />
          </div>

          {/* Role selector */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">I want to</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'buyer' })}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  form.role === 'buyer'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500'
                }`}
              >
                Buy items
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: 'seller' })}
                className={`py-3 rounded-xl border text-sm font-medium transition ${
                  form.role === 'seller'
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-500'
                }`}
              >
                Sell items
              </button>
            </div>
          </div>

          {/* Shop name — only shows if seller */}
          {form.role === 'seller' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <label className="block text-sm text-gray-400 mb-1">Shop Name</label>
              <input
                type="text"
                name="shopName"
                value={form.shopName}
                onChange={handleChange}
                required
                placeholder="My Thrift Shop"
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none border border-gray-700 focus:border-emerald-500 transition"
              />
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}