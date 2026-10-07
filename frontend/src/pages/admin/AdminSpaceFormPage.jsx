import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/endpoints.js'
import { Async, ErrorMessage } from '../../components/Status.jsx'
import { useLoad } from '../../hooks.js'

function SpaceForm({ space, onSubmit }) {
  const [form, setForm] = useState({
    name: space?.name ?? '',
    description: space?.description ?? '',
    location: space?.location ?? '',
    capacity: space?.capacity ?? '',
    imageUrl: space?.imageUrl ?? '',
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      await onSubmit({
        name: form.name,
        description: form.description,
        location: form.location,
        capacity: Number(form.capacity),
        imageUrl: form.imageUrl.trim() || null,
      })
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <label>
        Name
        <input required maxLength={100} value={form.name} onChange={set('name')} />
      </label>
      <label>
        Description
        <textarea required maxLength={5000} value={form.description} onChange={set('description')} />
      </label>
      <label>
        Location
        <input required maxLength={200} value={form.location} onChange={set('location')} />
      </label>
      <label>
        Capacity
        <input type="number" min="1" required value={form.capacity} onChange={set('capacity')} />
      </label>
      <label>
        Image URL (optional)
        <input maxLength={500} value={form.imageUrl} onChange={set('imageUrl')} />
      </label>
      <ErrorMessage error={error} />
      <button type="submit" disabled={busy}>
        Save
      </button>{' '}
      <Link to="/admin/spaces">Cancel</Link>
    </form>
  )
}

export default function AdminSpaceFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const editing = id !== undefined
  // No admin single-space endpoint is defined; find the space in the admin list.
  const state = useLoad(
    async () => {
      if (!editing) return null
      const all = await adminApi.spaces()
      const found = all.find((s) => String(s.id) === id)
      if (!found) throw new Error('Space not found.')
      return found
    },
    [id],
  )

  const save = async (body) => {
    if (editing) await adminApi.updateSpace(id, body)
    else await adminApi.createSpace(body)
    navigate('/admin/spaces')
  }

  return (
    <section>
      <h1>{editing ? 'Edit space' : 'Create space'}</h1>
      <Async state={state}>{(space) => <SpaceForm space={space} onSubmit={save} />}</Async>
    </section>
  )
}
