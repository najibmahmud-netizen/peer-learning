import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext' // Missing: Logic for persistence
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateSkill from './pages/CreateSkill'
import BookSession from './pages/BookSession'

/** 
 * ProtectedRoute Component:
 * Checks if a user exists in the AuthContext.
 * If not, it redirects them to login, fulfilling the Auth objective.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider> {/* Wraps the app to provide global user state without local storage */}
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<Home />} />
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App