import { useState } from 'react'
import { Link } from 'react-router-dom'
import { adminApi } from '../../api/endpoints.js'
import { Async, ErrorMessage } from '../../components/Status.jsx'
import { useLoad } from '../../hooks.js'

export default function AdminSpacesPage() {
  const [version, setVersion] = useState(0)
  const state = useLoad(() => adminApi.spaces(), [version])
  const [error, setError] = useState(null)

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
      <h1>Manage Spaces</h1>
      <p>
        <Link to="/admin/spaces/new">Create space</Link>
      </p>
      <ErrorMessage error={error} />
      <Async state={state}>
        {(spaces) => (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Active</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {spaces.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td>{s.location}</td>
                  <td>{s.capacity}</td>
                  <td>{s.active ? 'Active' : 'Inactive'}</td>
                  <td>
                    <Link to={`/admin/spaces/${s.id}/edit`}>Edit</Link>{' '}
                    <button type="button" onClick={() => toggle(s)}>
                      {s.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Async>
    </section>
  )
}
