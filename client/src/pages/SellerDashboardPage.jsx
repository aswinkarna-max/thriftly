// client/src/pages/SellerDashboardPage.jsx
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../features/authSlice.js'
import toast from 'react-hot-toast'

export default function SellerDashboardPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    toast.success('Logged out!')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-emerald-400">Welcome, {user?.name}!</h1>
        <p className="text-gray-400">Seller Dashboard — coming soon</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-400 text-white px-6 py-2 rounded-xl transition"
        >
          Logout
        </button>
      </div>
    </div>
  )
}