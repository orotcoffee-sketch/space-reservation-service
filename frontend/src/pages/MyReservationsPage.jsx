import { Link } from 'react-router-dom'
import { reservationsApi } from '../api/endpoints.js'
import { Async } from '../components/Status.jsx'
import { useLoad } from '../hooks.js'
import { hhmm } from '../time.js'

export default function MyReservationsPage() {
  const state = useLoad(() => reservationsApi.mine(), [])
  return (
    <section>
      <h1>My Reservations</h1>
      <Async state={state}>
        {(items) =>
          items.length === 0 ? (
            <p>
              No reservations yet. <Link to="/spaces">Browse spaces</Link>.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Space</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.space.name}</td>
                    <td>{r.reservationDate}</td>
                    <td>
                      {hhmm(r.startTime)} – {hhmm(r.endTime)}
                    </td>
                    <td>{r.status}</td>
                    <td>
                      <Link to={`/reservations/${r.id}`}>Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </Async>
    </section>
  )
}
