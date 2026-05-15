import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useUser } from '../context/UserContext'
import { BookOpen, Shield, Zap, Users, Eye, EyeOff, Check, X } from 'lucide-react'
import { useState } from 'react'
import { validateFormData, validatePassword } from '../utils/validation'

const API_URL = 'http://localhost:3000'

export default function Login() {
  const { login } = useUser()
  const navigate = useNavigate()

  // Views
  const [isSignUp, setIsSignUp] = useState(false)

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  })

  // UI states
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Handle Google success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true)
      const decoded = jwtDecode(credentialResponse.credential)
      const userData = {
        id: `google_${decoded.sub}`,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        authMethod: 'google',
      }

      // Check if user exists in db.json
      const res = await fetch(`${API_URL}/users?id=${userData.id}`)
      const existing = await res.json()

      if (existing.length === 0) {
        // POST new user
        await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        })
      }

      login(userData)
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Google authentication failed. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')

    // Validate form
    const validationErrors = validateFormData(formData, isSignUp)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    try {
      setIsLoading(true)

      if (isSignUp) {
        // Sign up logic
        const newUser = {
          id: `email_${Date.now()}`,
          name: formData.name,
          email: formData.email,
          password: formData.password, // In production, hash this on backend
          picture: null,
          authMethod: 'email',
          createdAt: new Date().toISOString(),
        }

        // Check if email already exists
        const existingEmail = await fetch(`${API_URL}/users?email=${formData.email}`)
        const existing = await existingEmail.json()

        if (existing.length > 0) {
          setErrors({ email: 'This email is already registered. Please sign in instead.' })
          return
        }

        // Create new user
        const response = await fetch(`${API_URL}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newUser),
        })

        if (!response.ok) throw new Error('Sign up failed')

        // Auto-login after sign up
        login(newUser)
        setSuccessMessage('Account created successfully! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1500)
      } else {
        // Sign in logic
        const response = await fetch(`${API_URL}/users?email=${formData.email}`)
        const users = await response.json()

        if (users.length === 0 || users[0].password !== formData.password) {
          setErrors({ submit: 'Invalid email or password' })
          return
        }

        const user = users[0]
        login(user)
        setSuccessMessage('Sign in successful! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 1500)
      }
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  // Password strength indicator for sign up
  const passwordValidation = isSignUp ? validatePassword(formData.password) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Panel - Informational Sidebar */}
        <div className="hidden md:flex bg-gradient-to-br from-blue-600 to-blue-800 p-12 text-white flex-col justify-center">
          <div className="mb-10">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center mb-6 backdrop-blur">
              <BookOpen className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h2 className="text-3xl font-bold mb-4">MoringaLearn</h2>
            <p className="text-blue-100 leading-relaxed text-lg">
              {isSignUp
                ? 'Join our peer learning community and start your journey today'
                : 'Welcome back! Access your learning dashboard'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
                <Users className="w-6 h-6 text-blue-200" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-lg">Peer Community</p>
                <p className="text-blue-100 text-sm mt-1">Learn from fellow Moringa students and build your network</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
                <Zap className="w-6 h-6 text-blue-200" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-lg">Instant Access</p>
                <p className="text-blue-100 text-sm mt-1">Book tutoring sessions and access resources in seconds</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur">
                <Shield className="w-6 h-6 text-blue-200" strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-semibold text-lg">Secure Login</p>
                <p className="text-blue-100 text-sm mt-1">Protected with industry-standard security and Google OAuth</p>
              </div>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-blue-100 text-sm">
              Join thousands of Moringa students taking control of their learning journey
            </p>
          </div>
        </div>

        {/* Right Panel - Form Area */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Header */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Sign In'}
            </h3>
            <p className="text-gray-600">
              {isSignUp
                ? 'Join MoringaLearn and start learning with peers'
                : 'Welcome back to your learning platform'}
            </p>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Name field - only for sign up */}
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className={`w-full px-4 py-3 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={isSignUp ? 'At least 8 characters' : 'Your password'}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator for sign up */}
              {isSignUp && formData.password && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-medium text-gray-600">Password requirements:</div>
                  <div className="space-y-1 text-xs">
                    <div className={`flex items-center gap-2 ${passwordValidation.feedback.length ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.feedback.length ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      At least 8 characters
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.feedback.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.feedback.uppercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      One uppercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.feedback.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.feedback.lowercase ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      One lowercase letter
                    </div>
                    <div className={`flex items-center gap-2 ${passwordValidation.feedback.number ? 'text-green-600' : 'text-gray-500'}`}>
                      {passwordValidation.feedback.number ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      One number
                    </div>
                  </div>
                </div>
              )}

              {errors.password && <p className="text-red-600 text-sm mt-2">{errors.password}</p>}
            </div>

            {/* Confirm Password field - only for sign up */}
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg outline-none transition focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed ${
                      errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : isSignUp ? (
                'Create Account'
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setErrors({ submit: 'Google authentication failed. Please try again.' })}
              size="large"
              width="100%"
              text={isSignUp ? 'signup_with' : 'signin_with'}
              shape="rectangular"
            />
          </div>

          {/* Toggle View */}
          <p className="text-center text-gray-600 text-sm">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp)
                setFormData({ email: '', password: '', confirmPassword: '', name: '' })
                setErrors({})
              }}
              disabled={isLoading}
              className="text-blue-600 font-semibold hover:underline disabled:cursor-not-allowed"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-6">
            By {isSignUp ? 'signing up, you agree' : 'signing in, you agree'} to our terms and privacy policy
          </p>
        </div>
      </div>
    </div>
  )
}
