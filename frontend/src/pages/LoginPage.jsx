import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext.js'
import { ErrorMessage } from '../components/Status.jsx'
import { Icon } from '../components/ui.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const member = await login(email, password)
      const fallback = member.role === 'ADMIN' ? '/admin/spaces' : '/spaces'
      navigate(location.state?.from ?? fallback, { replace: true })
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <section className="auth-card accent">
      <div className="auth-brand">
        <div className="logo">
          <Icon name="corporate_fare" size="lg" />
        </div>
        <span className="name">SpaceReserve</span>
        <span className="tag">Member Portal</span>
      </div>
      <h1>Sign In</h1>
      <p className="lead">Sign in to reserve and manage spaces.</p>
      {location.state?.registered && (
        <div role="status" className="alert alert-success">
          <Icon name="check_circle" fill />
          <div className="body">Registration complete. Please log in.</div>
        </div>
      )}
      <ErrorMessage error={error} title="Authentication failed" onDismiss={() => setError(null)} />
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            className="input"
            type="email"
            required
            autoComplete="email"
            placeholder="name@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <div className="label-row">
            <label htmlFor="login-password">Password</label>
            <span className="hint">8+ Characters</span>
          </div>
          <div className="input-wrap">
            <input
              id="login-password"
              className="input"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="sm" />
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy}>
          {busy ? 'Authenticating…' : 'Sign In'}
          <Icon name={busy ? 'sync' : 'arrow_forward'} size="sm" />
        </button>
      </form>
      <p className="auth-alt">
        No account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}
