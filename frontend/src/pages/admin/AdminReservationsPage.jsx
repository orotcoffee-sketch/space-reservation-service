import { adminApi } from '../../api/endpoints.js'
import { Async } from '../../components/Status.jsx'
import { useLoad } from '../../hooks.js'
import { hhmm } from '../../time.js'

export default function AdminReservationsPage() {
  const state = useLoad(() => adminApi.reservations(), [])
  return (
    <section>
      <h1>All Reservations</h1>
      <Async state={state}>
        {(items) =>
          items.length === 0 ? (
            <p>No reservations.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Space</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {items.map((r) => (
                  <tr key={r.reservationId}>
                    <td>
                      {r.member.name} ({r.member.email})
                    </td>
                    <td>{r.space.name}</td>
                    <td>{r.reservationDate}</td>
                    <td>
                      {hhmm(r.startTime)} – {hhmm(r.endTime)}
                    </td>
                    <td>{r.status}</td>
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
