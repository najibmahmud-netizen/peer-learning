import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { login, loginWithGoogle } = useAuth()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    try {
      setLoading(true)

      await login(email, password)

      alert('Login successful')

      navigate('/dashboard')
    } catch (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle()

      navigate('/dashboard')
    } catch (error) {
      alert(error.message)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Login
        </h2>

        <div className="mb-4">
          <label className="block mb-2 font-medium">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 font-medium">
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 transition text-white w-full py-3 rounded-lg font-semibold"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 border border-gray-300 hover:bg-gray-100 transition w-full py-3 rounded-lg font-medium"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don’t have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login