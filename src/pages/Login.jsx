import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'

import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle
} from '../services/authService'

import { validateFormData } from '../utils/validation'

export default function Login() {
  const { login } = useUser()
  const navigate = useNavigate()

  const [isSignUp, setIsSignUp] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccess('')

    const validation = validateFormData(formData, isSignUp)
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    try {
      setLoading(true)

      let user;
      if (isSignUp) {
        user = await signUpWithEmail(formData)
        setSuccess('Account created successfully!')
      } else {
        user = await signInWithEmail(formData.email, formData.password)
        setSuccess('Logged in successfully!')
      }
      
      // Update our global user state context and redirect
      login(user)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ submit: err.message || 'Authentication failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setErrors({})
    try {
      setLoading(true)
      const user = await signInWithGoogle()
      login(user)
      setSuccess('Google login successful!')
      navigate('/dashboard')
    } catch (err) {
      setErrors({ submit: err.message || 'Google Auth failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
            {isSignUp ? 'Create an Account' : 'Welcome Back'}
          </h2>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-200">
              {errors.submit}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-200">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <input
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {isSignUp && (
              <div>
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:bg-gray-400"
            >
              {loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Login'}
            </button>
          </form>

          <div className="my-6 flex items-center justify-between text-gray-400">
            <hr className="w-full border-gray-200" />
            <span className="text-xs uppercase px-2">or</span>
            <hr className="w-full border-gray-200" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            type="button"
            className="w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.57 14.96 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.6 2.8C6.01 7.42 8.78 5.04 12 5.04z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.66 2.84c2.14-1.98 3.37-4.89 3.37-8.57z"/>
              <path fill="#FBBC05" d="M5.1 14.7c-.25-.75-.39-1.55-.39-2.37s.14-1.62.39-2.37l-3.6-2.8C.54 8.94 0 10.42 0 12s.54 3.06 1.5 4.47l3.6-2.77z"/>
              <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.66-2.84c-1.01.67-2.3 1.08-4.3 1.08-3.22 0-5.99-2.38-6.96-5.26l-3.6 2.8C3.4 20.35 7.35 23 12 23z"/>
            </svg>
            Continue with Google
          </button>

          <p className="text-sm text-center mt-6 text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              className="text-blue-600 font-medium ml-1 hover:underline"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}