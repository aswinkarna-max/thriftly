// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { logoutUser } from '../features/authSlice.js'
import toast from 'react-hot-toast'
import { FiShoppingBag, FiLogOut, FiUser, FiPlusCircle } from 'react-icons/fi'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const cartItems = useSelector((state) => state.cart.items)
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0)
  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
      style={{
        background: 'rgba(3,7,18,0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(52,211,153,0.12)',
      }}
    >
      {/* Logo */}
      <Link to="/home" className="text-2xl font-extrabold tracking-tight"
        style={{ background: 'linear-gradient(135deg,#34d399,#059669)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Thriftly
      </Link>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-8">
        <Link to="/home" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Explore</Link>
            {user?.role === 'buyer' && (
            <Link to="/orders" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">My Orders</Link>
            )}
            {user?.role === 'seller' && (
            <>
            <Link to="/seller/dashboard" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Dashboard</Link>
            <Link to="/seller/orders" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Orders</Link>
          </>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {user?.role === 'seller' && (
          <Link to="/seller/dashboard"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full hover:bg-emerald-500/10 transition-all">
            <FiPlusCircle size={15} /> New listing
          </Link>
        )}
        {user?.role === 'buyer' && (
        <Link to="/cart"
            className="relative flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors px-3 py-2">
            <FiShoppingBag size={18} />
            {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
             style={{ background: '#059669', color: 'white' }}>
            {cartCount}
            </span>
      )}
  </Link>
)}
        <div className="flex items-center gap-2 bg-gray-800/60 border border-white/5 rounded-full px-3 py-1.5">
          <FiUser size={14} className="text-gray-400" />
          <span className="text-sm text-gray-300 hidden md:block">{user?.name}</span>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-400 transition-colors px-2 py-2">
          <FiLogOut size={16} />
        </button>
      </div>
    </motion.nav>
  )
}