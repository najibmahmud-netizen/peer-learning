import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useUser()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/explore', label: 'Explore' },
  ]

  if (isAuthenticated) {
    navLinks.push({ to: '/dashboard', label: 'Dashboard' })
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo Brand Text */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tight">
              <span className="text-gray-900">Moringa</span>
              <span className="text-blue-600">Learn</span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2">
                <span className="text-sm font-semibold text-gray-900">
                  {user?.name || 'user name'}
                </span>

                <button
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Button Text */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-sm font-semibold uppercase tracking-wider text-gray-600 hover:text-gray-900"
            >
              {mobileOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-6 py-4 space-y-3 flex flex-col text-sm font-medium text-gray-600">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={isActive(link.to) ? 'text-blue-600 font-semibold' : 'hover:text-blue-600'}
              >
                {link.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <>
                <span className="text-gray-900 font-semibold pt-2">
                  {user?.name || 'user name'}
                </span>
                <button
                  onClick={() => {
                    logout()
                    setMobileOpen(false)
                  }}
                  className="text-left hover:text-blue-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="text-blue-600 font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}