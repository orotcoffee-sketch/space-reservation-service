import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/endpoints.js'
import { ErrorMessage } from '../components/Status.jsx'
import { Icon } from '../components/ui.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))
  const mismatch = confirm !== '' && confirm !== form.password
  const lengthPct = Math.min(100, Math.round((form.password.length / 8) * 100))

  async function onSubmit(e) {
    e.preventDefault()
    if (form.password !== confirm) return
    setBusy(true)
    setError(null)
    try {
      await authApi.register(form.email, form.password, form.name)
      navigate('/login', { state: { registered: true } })
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  const type = showPassword ? 'text' : 'password'
  const toggle = (
    <button
      type="button"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? 'Hide password' : 'Show password'}
    >
      <Icon name={showPassword ? 'visibility_off' : 'visibility'} size="sm" />
    </button>
  )

  return (
    <section className="auth-card left">
      <div className="brandline">
        <Icon name="corporate_fare" fill />
        <span>SpaceReserve</span>
      </div>
      <h1>Create Member Account</h1>
      <p className="lead">Create an account to reserve spaces.</p>
      <ErrorMessage error={error} title="Registration failed" onDismiss={() => setError(null)} />
      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="reg-name">Full Name</label>
          <input
            id="reg-name"
            className="input"
            required
            maxLength={100}
            autoComplete="name"
            value={form.name}
            onChange={set('name')}
          />
        </div>
        <div className="field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className="input"
            type="email"
            required
            maxLength={255}
            autoComplete="email"
            value={form.email}
            onChange={set('email')}
          />
        </div>
        <div className="field">
          <label htmlFor="reg-password">Create Password</label>
          <div className="input-wrap">
            <input
              id="reg-password"
              className="input"
              type={type}
              required
              minLength={8}
              maxLength={72}
              autoComplete="new-password"
              placeholder="8 to 72 characters"
              value={form.password}
              onChange={set('password')}
            />
            {toggle}
          </div>
          <div className="meter-row">
            <div className="meter" aria-hidden="true">
              <span style={{ width: `${lengthPct}%` }} />
            </div>
            <span className="hint">At least 8 chars</span>
          </div>
        </div>
        <div className="field">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <div className="input-wrap">
            <input
              id="reg-confirm"
              className={`input${mismatch ? ' invalid' : ''}`}
              type={type}
              required
              maxLength={72}
              autoComplete="new-password"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {toggle}
          </div>
          {mismatch && <span className="field-error">Passwords do not match.</span>}
        </div>
        <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={busy || mismatch}>
          Create Account
          <Icon name="arrow_forward" size="sm" />
        </button>
      </form>
      <p className="auth-alt">
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
