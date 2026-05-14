import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const { register, loginWithGoogle } = useAuth()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill all fields')
      return
    }

    if (password.length < 6) {
      alert('Password should be at least 6 characters')
      return
    }

    try {
      setLoading(true)

      await register(email, password)

      alert('Account created successfully')

      navigate('/dashboard')
    } catch (error) {
      alert(error.message)
    }

    setLoading(false)
  }

  const handleGoogleSignup = async () => {
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
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Create Account
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
            placeholder="Enter password"
            className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 transition text-white w-full py-3 rounded-lg font-semibold"
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="mt-4 border border-gray-300 hover:bg-gray-100 transition w-full py-3 rounded-lg font-medium"
        >
          Continue with Google
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Register