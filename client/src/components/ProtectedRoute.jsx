// client/src/components/ProtectedRoute.jsx
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function ProtectedRoute({ children, roleRequired }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) return <Navigate to="/login" replace />

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/home" replace />
  }

  return children
}