import { useState } from 'react'
import { adminApi } from '../../api/endpoints.js'
import { Async } from '../../components/Status.jsx'
import { EmptyState, Icon, StatusBadge } from '../../components/ui.jsx'
import { useLoad } from '../../hooks.js'
import { fmt12, fmtDateShort } from '../../time.js'

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export default function AdminReservationsPage() {
  const state = useLoad(() => adminApi.reservations(), [])
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('ALL')

  function reset() {
    setQuery('')
    setStatus('ALL')
  }

  return (
    <section>
      <div className="head-card">
        <div className="page-head">
          <h1>All Member Reservations</h1>
          <p className="sub">View all member reservations.</p>
        </div>
      </div>

      <Async state={state}>
        {(items) => {
          const q = query.trim().toLowerCase()
          const shown = items.filter(
            (r) =>
              (status === 'ALL' || r.status === status) &&
              (!q || `${r.reservationId} ${r.member.name} ${r.member.email} ${r.space.name}`.toLowerCase().includes(q)),
          )
          return (
            <>
              <div className="toolbar flat">
                <div className="search">
                  <Icon name="search" />
                  <input
                    className="input"
                    type="search"
                    placeholder="Search member, email, reservation ID, or room…"
                    aria-label="Search reservations"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
                <label className="filter-label" htmlFor="status-filter">
                  Status:
                </label>
                <select id="status-filter" className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="ALL">All Statuses</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <button type="button" className="linkbtn" onClick={reset}>
                  Reset
                </button>
              </div>
              {items.length === 0 ? (
                <div className="table-card after-toolbar">
                  <EmptyState icon="event_busy" title="No reservations">
                    No member has made a reservation yet.
                  </EmptyState>
                </div>
              ) : shown.length === 0 ? (
                <div className="table-card after-toolbar" style={{ padding: '1.5rem' }}>
                  <EmptyState icon="search_off" title="No reservations found">
                    Try changing your search or status filter.
                  </EmptyState>
                </div>
              ) : (
                <div className="table-card after-toolbar">
                  <table className="data stack-md">
                    <thead>
                      <tr>
                        <th>Reservation ID</th>
                        <th>Member</th>
                        <th>Space</th>
                        <th>Date</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((r) => {
                        const cancelled = r.status === 'CANCELLED'
                        return (
                          <tr key={r.reservationId}>
                            <td data-label="Reservation ID">
                              <span className="id-pill">#{r.reservationId}</span>
                            </td>
                            <td className="lead">
                              <div className="person">
                                <span className="ini">{initials(r.member.name)}</span>
                                <div>
                                  <strong>{r.member.name}</strong>
                                  <small>{r.member.email}</small>
                                </div>
                              </div>
                            </td>
                            <td data-label="Space">{r.space.name}</td>
                            <td data-label="Date">{fmtDateShort(r.reservationDate)}</td>
                            <td data-label="Start Time" className={cancelled ? 'struck' : ''}>
                              {fmt12(r.startTime)}
                            </td>
                            <td data-label="End Time" className={cancelled ? 'struck' : ''}>
                              {fmt12(r.endTime)}
                            </td>
                            <td data-label="Status">
                              <StatusBadge status={r.status} />
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  <div className="table-foot">
                    Showing {shown.length} of {items.length} reservations
                  </div>
                </div>
              )}
            </>
          )
        }}
      </Async>
    </section>
  )
}
