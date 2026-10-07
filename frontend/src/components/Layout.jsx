import { Link, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext.js'

export default function Layout() {
  const { member, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <>
      <header className="nav">
        <strong>Space Reservation</strong>
        {isAuthenticated ? (
          <nav>
            <Link to="/spaces">Spaces</Link>
            {member.role === 'MEMBER' && <Link to="/reservations">My Reservations</Link>}
            {member.role === 'ADMIN' && <Link to="/admin/spaces">Admin Spaces</Link>}
            {member.role === 'ADMIN' && <Link to="/admin/reservations">Admin Reservations</Link>}
            <span>
              {member.name} ({member.role})
            </span>
            <button
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Log out
            </button>
          </nav>
        ) : (
          <nav>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
