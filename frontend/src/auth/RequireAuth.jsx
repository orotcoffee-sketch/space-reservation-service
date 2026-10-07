import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './authContext.js'

export default function RequireAuth({ role }) {
  const { isAuthenticated, member } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (role && member.role !== role) return <p role="alert" className="error">You do not have permission to view this page.</p>
  return <Outlet />
}
