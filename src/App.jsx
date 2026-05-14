import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSkill from './pages/CreateSkill'
import BookSession from './pages/BookSession'
import ExploreSkills from './pages/ExploreSkills'

/** 
 * ProtectedRoute Component:
 * Checks if a user exists in the AuthContext.
 * If not, it redirects them to login, fulfilling the Auth objective.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>
  return user ? children : <Navigate to="/login" />
}

function App() {
  const { user, loading } = useAuth()

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      {user && <Navbar />}

      <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />

          {/* Protected Routes: Only accessible after Authentication */}
          <Route 
            path='/dashboard' 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/create-skill' 
            element={
              <ProtectedRoute>
                <CreateSkill />
              </ProtectedRoute>
            } 
          />
          <Route 
            path='/book-session' 
            element={
              <ProtectedRoute>
                <BookSession />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback for 404s */}
          <Route path="*" element={<Navigate to={user ? '/dashboard' : '/login'} />} />
        </Routes>

        <Route
  path='/explore-skills'
  element={
    <ProtectedRoute>
      <ExploreSkills />
    </ProtectedRoute>
  }
/>
    </div>
  )
}

export default App