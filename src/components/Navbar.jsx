import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="logo">PeerLearn</h1>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/create-skill">Teach</Link></li>
        <li><Link to="/book-session">Book</Link></li>
        <li>
          <Link
            to="/login"
            className="login-btn"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar