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
        <Link to="/categories" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Categories</Link>
        {user?.role === 'seller' && (
          <Link to="/seller/dashboard" className="text-sm text-gray-400 hover:text-emerald-400 transition-colors">Dashboard</Link>
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
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors px-3 py-2">
            <FiShoppingBag size={18} />
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