import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { Loader } from 'lucide-react'

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication
 * Redirects to login if user is not authenticated
 */
export default function ProtectedRoute({
  children,
  requiredRole = null, // Optional: restrict by role (e.g., 'tutor', 'student')
  fallback = null, // Optional: custom fallback component
}) {
  const { user, isAuthenticated } = useUser()

  // Check if still loading (optional - can implement with useEffect if needed)
  if (!isAuthenticated) {
    if (fallback) {
      return fallback
    }
    return <Navigate to="/login" replace />
  }

  // Check role if required
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

/**
 * Loading Fallback Component
 * Shows while checking authentication status
 */
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

