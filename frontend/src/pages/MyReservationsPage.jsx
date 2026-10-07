import { useState } from 'react'
import { Link } from 'react-router-dom'
import { reservationsApi } from '../api/endpoints.js'
import { Async, ErrorMessage } from '../components/Status.jsx'
import { EmptyState, Icon, StatusBadge } from '../components/ui.jsx'
import { useLoad } from '../hooks.js'
import { durationLabel, durationMinutes, fmt12, fmtDateShort, isPastStart } from '../time.js'

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'past', label: 'Past' },
  { key: 'cancelled', label: 'Cancelled' },
]

// Presentation grouping only: derived from status + start time (Asia/Seoul), as in the API contract.
function group(items) {
  const upcoming = items
    .filter((r) => r.status === 'CONFIRMED' && !isPastStart(r.reservationDate, r.startTime))
    .sort((a, b) => `${a.reservationDate} ${a.startTime}`.localeCompare(`${b.reservationDate} ${b.startTime}`))
  const past = items.filter((r) => r.status === 'CONFIRMED' && isPastStart(r.reservationDate, r.startTime))
  const cancelled = items.filter((r) => r.status === 'CANCELLED')
  return { upcoming, past, cancelled }
}

export default function MyReservationsPage() {
  const [version, setVersion] = useState(0)
  const state = useLoad(() => reservationsApi.mine(), [version])
  const [tab, setTab] = useState('upcoming')
  const [error, setError] = useState(null)

  async function onCancel(r) {
    if (!window.confirm('Cancel this reservation?')) return
    setError(null)
    try {
      await reservationsApi.cancel(r.id)
      setVersion((v) => v + 1)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <section>
      <div className="page-head">
        <h1 className="title-icon">
          <Icon name="event_available" />
          My Reservations
        </h1>
        <p className="sub">View and manage your space reservations.</p>
      </div>
      <ErrorMessage error={error} />
      <Async state={state}>
        {(items) => {
          if (items.length === 0)
            return (
              <EmptyState
                icon="event_available"
                title="No reservations yet"
                action={
                  <Link to="/spaces" className="btn btn-primary">
                    Browse spaces
                  </Link>
                }
              >
                Reserve a space to see it here.
              </EmptyState>
            )
          const groups = group(items)
          const list = groups[tab]
          return (
            <>
              <div className="tabs" role="tablist">
                {TABS.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    role="tab"
                    aria-selected={tab === t.key}
                    className={`tab${tab === t.key ? ' on' : ''}`}
                    onClick={() => setTab(t.key)}
                  >
                    {t.label}
                    <span className="count">{groups[t.key].length}</span>
                  </button>
                ))}
              </div>
              {list.length === 0 ? (
                <EmptyState icon="event_busy" title={`No ${tab} reservations`}>
                  {tab === 'upcoming' ? 'Your confirmed future reservations will appear here.' : 'Nothing to show in this tab.'}
                </EmptyState>
              ) : (
                <ul className="res-list">
                  {list.map((r) =>
                    tab === 'upcoming' ? (
                      <li key={r.id} className="res-card">
                        <div className="res-top">
                          <div>
                            <div className="res-id">#{r.id}</div>
                            <div className="res-name">{r.space.name}</div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                        <div className="res-info">
                          <div>
                            <Icon name="location_on" size="sm" />
                            {r.space.location}
                          </div>
                          <div>
                            <Icon name="schedule" size="sm" />
                            <span>
                              {fmtDateShort(r.reservationDate)}
                              <small>
                                {fmt12(r.startTime)} – {fmt12(r.endTime)} ({durationLabel(durationMinutes(r.startTime, r.endTime))})
                              </small>
                            </span>
                          </div>
                        </div>
                        <div className="res-actions">
                          <Link to={`/reservations/${r.id}`} className="btn btn-tonal btn-sm">
                            <Icon name="info" size="sm" />
                            Details
                          </Link>
                          <Link to={`/reservations/${r.id}?edit=1`} className="btn btn-tonal btn-sm">
                            <Icon name="edit_calendar" size="sm" />
                            Modify
                          </Link>
                          <button type="button" className="btn btn-danger btn-sm" onClick={() => onCancel(r)}>
                            <Icon name="cancel" size="sm" />
                            Cancel
                          </button>
                        </div>
                      </li>
                    ) : (
                      <li key={r.id} className="res-card compact">
                        <div>
                          <div style={{ marginBottom: '0.375rem' }}>
                            {tab === 'cancelled' ? (
                              <StatusBadge status={r.status} />
                            ) : (
                              <span className="readonly-note">Past reservation (Read-only)</span>
                            )}
                          </div>
                          <div className="res-name">{r.space.name}</div>
                          <div className="res-id">
                            #{r.id} • {fmtDateShort(r.reservationDate)} • {fmt12(r.startTime)} – {fmt12(r.endTime)}
                          </div>
                        </div>
                        <Link to={`/reservations/${r.id}`} className="btn btn-tonal btn-sm">
                          <Icon name="info" size="sm" />
                          Details
                        </Link>
                      </li>
                    ),
                  )}
                </ul>
              )}
            </>
          )
        }}
      </Async>
    </section>
  )
}
