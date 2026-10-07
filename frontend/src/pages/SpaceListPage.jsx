import { Link } from 'react-router-dom'
import { spacesApi } from '../api/endpoints.js'
import { Async } from '../components/Status.jsx'
import { EmptyState, Icon, SpaceImage } from '../components/ui.jsx'
import { useLoad } from '../hooks.js'

export default function SpaceListPage() {
  const state = useLoad(() => spacesApi.list(), [])
  return (
    <section>
      <div className="page-head">
        <h1>Available Spaces</h1>
        <p className="sub">Reserve meeting rooms, study pods, and collaborative workspaces.</p>
      </div>
      <Async state={state}>
        {(spaces) =>
          spaces.length === 0 ? (
            <EmptyState icon="meeting_room" title="No spaces available">
              Check back later for reservable spaces.
            </EmptyState>
          ) : (
            <ul className="space-grid">
              {spaces.map((s) => (
                <li key={s.id} className="space-card">
                  <div className="media h44">
                    <SpaceImage src={s.imageUrl} />
                    {s.imageUrl && <div className="shade" />}
                  </div>
                  <div className="body">
                    <h2>{s.name}</h2>
                    <div className="meta">
                      <span>
                        <Icon name="location_on" size="sm" />
                        {s.location}
                      </span>
                      <span>
                        <Icon name="group" size="sm" />
                        {s.capacity} people capacity
                      </span>
                    </div>
                    <Link to={`/spaces/${s.id}`} className="btn btn-tonal btn-lg btn-block">
                      View Details
                      <Icon name="arrow_forward" size="sm" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </Async>
    </section>
  )
}
