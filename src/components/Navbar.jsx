import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error("Logout failed:", error.message)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#1e3a8a]/90 backdrop-blur-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-white hover:opacity-90 transition-opacity">
          PeerLearn
        </Link>
        
        
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link to="/dashboard" className="text-slate-300 hover:text-white transition-colors">Dashboard</Link>
          <Link to="/create-skill" className="text-slate-300 hover:text-white transition-colors">Teach</Link>
          <Link to="/book-session" className="text-blue-400 hover:text-blue-300 transition-colors">Book</Link>
          <Link to="/explore-skills" className="text-slate-300 hover:text-white transition-colors">Explore</Link>

          <button 
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-red-500 transition-all active:scale-95"
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
