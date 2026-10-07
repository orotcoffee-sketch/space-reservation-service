import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext.js'
import { Icon } from './ui.jsx'

function Brand({ to }) {
  return (
    <Link to={to} className="brand">
      <Icon name="corporate_fare" fill />
      <span>
        Space<b>Reserve</b>
      </span>
    </Link>
  )
}

export default function Layout() {
  const { member, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  // Login / register: centered card, no application chrome.
  if (!isAuthenticated) {
    return (
      <div className="auth-wrap">
        <Outlet />
      </div>
    )
  }

  const isAdmin = member.role === 'ADMIN'
  const links = isAdmin
    ? [
        { to: '/admin/spaces', label: 'Spaces' },
        { to: '/admin/reservations', label: 'Reservations' },
      ]
    : [
        { to: '/spaces', label: 'Spaces' },
        { to: '/reservations', label: 'My Reservations' },
      ]

  function onLogout() {
    logout()
    navigate('/login')
  }

  return (
    <>
      <header className={`topbar ${isAdmin ? 'admin' : 'member'}`}>
        <div className="topbar-inner">
          <Brand to={isAdmin ? '/admin/spaces' : '/spaces'} />
          <nav className="topnav" aria-label="Main">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/spaces'} className={({ isActive }) => (isActive ? 'active' : '')}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="topbar-right">
            <span className={`rolepill${isAdmin ? ' admin' : ''}`}>{member.role}</span>
            <span className="who">{member.name}</span>
            <button type="button" className="linkbtn" onClick={onLogout}>
              Logout
            </button>
            <span className="avatar" title={member.email}>
              <Icon name="person" fill />
            </span>
          </div>
        </div>
      </header>
      <main className={`app-main${isAdmin ? '' : ' with-bottomnav'}`}>
        <Outlet />
      </main>
      {!isAdmin && (
        <nav className="bottomnav" aria-label="Main">
          <NavLink to="/spaces" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon name="meeting_room" />
            Spaces
          </NavLink>
          <NavLink to="/reservations" className={({ isActive }) => (isActive ? 'active' : '')}>
            <Icon name="event_available" />
            My Reservations
          </NavLink>
          <button type="button" onClick={onLogout}>
            <Icon name="logout" />
            Logout
          </button>
        </nav>
      )}
    </>
  )
}
