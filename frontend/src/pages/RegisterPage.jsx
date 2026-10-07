import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/endpoints.js'
import { ErrorMessage } from '../components/Status.jsx'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
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

  return (
    <section>
      <h1>Register</h1>
      <form onSubmit={onSubmit}>
        <label>
          Name
          <input required maxLength={100} value={form.name} onChange={set('name')} />
        </label>
        <label>
          Email
          <input type="email" required maxLength={255} value={form.email} onChange={set('email')} />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={form.password}
            onChange={set('password')}
          />
        </label>
        <ErrorMessage error={error} />
        <button type="submit" disabled={busy}>
          Register
        </button>
      </form>
      <p>
        Already registered? <Link to="/login">Log in</Link>
      </p>
    </section>
  )
}
