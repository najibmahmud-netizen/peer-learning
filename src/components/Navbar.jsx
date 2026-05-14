import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <h1 className="logo">PeerLearn</h1>

      <ul className="nav-links">
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/create-skill">Teach</Link></li>
            <li><Link to="/book-session">Book</Link></li>
            <li>
              <button type="button" className="login-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
      </ul>
    </nav>
  )
}

export default Navbar