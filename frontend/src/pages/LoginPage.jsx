import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext.js'
import { ErrorMessage } from '../components/Status.jsx'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <section>
      <h1>Login</h1>
      {location.state?.registered && <p>Registration complete. Please log in.</p>}
      <form onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          Password
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <ErrorMessage error={error} />
        <button type="submit" disabled={busy}>
          Log in
        </button>
      </form>
      <p>
        No account? <Link to="/register">Register</Link>
      </p>
    </section>
  )
}
