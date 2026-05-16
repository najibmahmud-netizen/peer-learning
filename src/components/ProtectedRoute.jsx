import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Loader } from 'lucide-react'


export default function ProtectedRoute({
  children,
  requiredRole = null, 
  fallback = null, 
}) {
  const { user, isAuthenticated } = useUser()

  
  if (!isAuthenticated) {
    if (fallback) {
      return fallback
    }
    return <Navigate to="/login" replace />
  }

  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}


export function AuthLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

