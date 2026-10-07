import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminApi } from '../../api/endpoints.js'
import { Async, ErrorMessage } from '../../components/Status.jsx'
import { Icon } from '../../components/ui.jsx'
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
    <form className="card form-card" onSubmit={submit}>
      <div className="field">
        <label htmlFor="space-name">Space Name</label>
        <input id="space-name" className="input" required maxLength={100} value={form.name} onChange={set('name')} />
      </div>
      <div className="field">
        <label htmlFor="space-description">Description</label>
        <textarea
          id="space-description"
          className="textarea"
          required
          maxLength={5000}
          value={form.description}
          onChange={set('description')}
        />
      </div>
      <div className="field">
        <label htmlFor="space-location">Location</label>
        <input id="space-location" className="input" required maxLength={200} value={form.location} onChange={set('location')} />
      </div>
      <div className="field">
        <label htmlFor="space-capacity">Capacity</label>
        <input
          id="space-capacity"
          className="input"
          type="number"
          min="1"
          required
          value={form.capacity}
          onChange={set('capacity')}
        />
      </div>
      <div className="field">
        <div className="label-row">
          <label htmlFor="space-image">Image URL</label>
          <span className="hint">Optional</span>
        </div>
        <input id="space-image" className="input" maxLength={500} value={form.imageUrl} onChange={set('imageUrl')} />
      </div>
      <ErrorMessage error={error} />
      <div className="actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={busy}>
          Save
        </button>
        <Link to="/admin/spaces" className="btn btn-secondary btn-lg">
          Cancel
        </Link>
      </div>
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
      <Link to="/admin/spaces" className="backlink">
        <Icon name="arrow_back" size="sm" />
        Back to Spaces
      </Link>
      <div className="page-head">
        <div className="eyebrow">
          <Icon name="admin_panel_settings" size="sm" />
          Admin
        </div>
        <h1>{editing ? 'Edit Space' : 'Create Space'}</h1>
        <p className="sub">
          {editing ? 'Update the details of this reservable space.' : 'Add a new reservable space. New spaces start active.'}
        </p>
      </div>
      <Async state={state}>{(space) => <SpaceForm space={space} onSubmit={save} />}</Async>
    </section>
  )
}
