import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useUser()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

 
  return children
}