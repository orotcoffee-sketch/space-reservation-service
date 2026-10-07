import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './authContext.js'
import { EmptyState } from '../components/ui.jsx'

export default function RequireAuth({ role }) {
  const { isAuthenticated, member } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  if (role && member.role !== role)
    return (
      <div role="alert">
        <EmptyState icon="lock" title="Access denied">
          You do not have permission to view this page.
        </EmptyState>
      </div>
    )
  return <Outlet />
}
