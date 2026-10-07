import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/endpoints.js'
import { Async, ErrorMessage } from '../../components/Status.jsx'
import { ActiveBadge, EmptyState, Icon, SpaceImage } from '../../components/ui.jsx'
import { useLoad } from '../../hooks.js'

const FILTERS = [
  { key: 'any', label: 'Any Status' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Inactive' },
]

export default function AdminSpacesPage() {
  const [version, setVersion] = useState(0)
  const state = useLoad(() => adminApi.spaces(), [version])
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('any')

  async function toggle(space) {
    setError(null)
    try {
      await adminApi.setSpaceStatus(space.id, !space.active)
      setVersion((v) => v + 1)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <section>
      <div className="head-card">
        <div className="page-head title-row">
          <div>
            <div className="eyebrow">
              <Icon name="admin_panel_settings" size="sm" />
              Admin
            </div>
            <h1>Space Inventory &amp; Management</h1>
            <p className="sub">Create, edit, activate, and deactivate reservable spaces.</p>
          </div>
          <Link to="/admin/spaces/new" className="btn btn-primary btn-lg">
            <Icon name="add" size="sm" />
            Create Space
          </Link>
        </div>
      </div>

      <div className="notice">
        <Icon name="info" />
        <span>
          <strong>Note:</strong> Permanent deletion is disabled to protect historical reservation records. Deactivate spaces
          instead when spaces are unavailable.
        </span>
      </div>

      <div className="toolbar">
        <div className="search">
          <Icon name="search" />
          <input
            className="input"
            type="search"
            placeholder="Search spaces by name, location, or ID…"
            aria-label="Search spaces"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="seg" role="group" aria-label="Status filter">
          {FILTERS.map((f) => (
            <button key={f.key} type="button" className={filter === f.key ? 'on' : ''} onClick={() => setFilter(f.key)}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <ErrorMessage error={error} />
      <Async state={state}>
        {(spaces) => {
          const q = query.trim().toLowerCase()
          const shown = spaces.filter(
            (s) =>
              (filter === 'any' || (filter === 'active' ? s.active : !s.active)) &&
              (!q || `${s.name} ${s.location} ${s.id}`.toLowerCase().includes(q)),
          )
          if (spaces.length === 0)
            return (
              <EmptyState icon="meeting_room" title="No spaces yet">
                Create the first reservable space.
              </EmptyState>
            )
          if (shown.length === 0)
            return (
              <EmptyState icon="search_off" title="No spaces found">
                Try changing your search or status filter.
              </EmptyState>
            )
          return (
            <div className="table-card">
              <table className="data">
                <thead>
                  <tr>
                    <th>Space Details</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Status</th>
                    <th className="right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {shown.map((s) => (
                    <tr key={s.id} className={s.active ? '' : 'dim'}>
                      <td className="lead">
                        <div className="cell-space">
                          <div className="thumb-sm">
                            <SpaceImage src={s.imageUrl} />
                          </div>
                          <div>
                            <div className="cell-name">{s.name}</div>
                            <div className="cell-sub">ID {s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td data-label="Location">{s.location}</td>
                      <td data-label="Capacity">
                        <span className="seats">
                          <Icon name="chair" size="sm" />
                          {s.capacity} seats
                        </span>
                      </td>
                      <td data-label="Status">
                        <ActiveBadge active={s.active} />
                      </td>
                      <td className="right">
                        <span className="row-actions">
                          <Link to={`/admin/spaces/${s.id}/edit`} className="btn btn-secondary btn-sm">
                            Edit
                          </Link>
                          <button type="button" className={`btn btn-sm ${s.active ? 'btn-tonal' : 'btn-accent'}`} onClick={() => toggle(s)}>
                            {s.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="table-foot">
                Showing {shown.length} of {spaces.length} spaces
              </div>
            </div>
          )
        }}
      </Async>
    </section>
  )
}
