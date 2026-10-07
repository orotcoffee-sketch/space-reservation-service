import { Link } from 'react-router-dom'
import { spacesApi } from '../api/endpoints.js'
import { Async } from '../components/Status.jsx'
import { useLoad } from '../hooks.js'

export default function SpaceListPage() {
  const state = useLoad(() => spacesApi.list(), [])
  return (
    <section>
      <h1>Spaces</h1>
      <Async state={state}>
        {(spaces) =>
          spaces.length === 0 ? (
            <p>No spaces available.</p>
          ) : (
            <ul className="grid">
              {spaces.map((s) => (
                <li key={s.id} className="card">
                  {s.imageUrl && <img src={s.imageUrl} alt="" />}
                  <h2>
                    <Link to={`/spaces/${s.id}`}>{s.name}</Link>
                  </h2>
                  <p>{s.location}</p>
                  <p>Capacity: {s.capacity}</p>
                </li>
              ))}
            </ul>
          )
        }
      </Async>
    </section>
  )
}
