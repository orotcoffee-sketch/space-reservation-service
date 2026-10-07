import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { reservationsApi, spacesApi } from '../api/endpoints.js'
import { Async, ErrorMessage } from '../components/Status.jsx'
import { EmptyState, Icon, SpaceImage } from '../components/ui.jsx'
import { useLoad } from '../hooks.js'
import { durationLabel, durationMinutes, fmt12, fmtDateLong } from '../time.js'

export default function ReservationConfirmPage() {
  const [params] = useSearchParams()
  const spaceId = params.get('spaceId')
  const date = params.get('date')
  const start = params.get('start')
  const end = params.get('end')
  const navigate = useNavigate()
  const space = useLoad(() => (spaceId ? spacesApi.get(spaceId) : Promise.resolve(null)), [spaceId])
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  if (!spaceId || !date || !start || !end) {
    return (
      <EmptyState
        icon="event_busy"
        title="Missing reservation details"
        action={
          <Link to="/spaces" className="btn btn-primary">
            Choose a space
          </Link>
        }
      >
        Pick a space, date and time to continue.
      </EmptyState>
    )
  }

  async function onConfirm() {
    setBusy(true)
    setError(null)
    try {
      await reservationsApi.create({
        spaceId: Number(spaceId),
        reservationDate: date,
        startTime: start,
        endTime: end,
      })
      navigate('/reservations')
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  const minutes = durationMinutes(start, end)

  return (
    <section>
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/spaces">Spaces</Link>
        <Icon name="chevron_right" />
        <Link to={`/spaces/${spaceId}`}>{space.data?.name ?? 'Space'}</Link>
        <Icon name="chevron_right" />
        <span className="current">Confirm</span>
      </nav>
      <div className="page-head">
        <h1>Confirm Your Reservation</h1>
        <p className="sub">Please review your booking details before confirming your reservation.</p>
      </div>

      <div className="confirm-layout">
        <div className="card" style={{ overflow: 'hidden' }}>
          <Async state={space}>
            {(s) => (
              <>
                <div className={`confirm-hero media${s.imageUrl ? '' : ' noimg'}`}>
                  <SpaceImage src={s.imageUrl} />
                  {s.imageUrl && <div className="shade" />}
                  <div className="caption">
                    <small>
                      <Icon name="location_on" size="sm" />
                      {s.location}
                    </small>
                    <h2>{s.name}</h2>
                  </div>
                </div>
                <div className="facts">
                  <div className="fact">
                    <small>Capacity</small>
                    <strong>
                      <Icon name="group" />
                      {s.capacity} People
                    </strong>
                  </div>
                  <div className="fact">
                    <small>Location</small>
                    <strong>
                      <Icon name="location_on" />
                      {s.location}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </Async>
        </div>

        <aside className="card">
          <div className="summary-head">Reservation Summary</div>
          <div className="summary-body">
            <div className="sum-tile">
              <div className="ico">
                <Icon name="calendar_month" />
              </div>
              <div>
                <small>Date</small>
                <strong>{fmtDateLong(date)}</strong>
              </div>
            </div>
            <div className="sum-tile">
              <div className="ico">
                <Icon name="schedule" />
              </div>
              <div>
                <small>Time Window</small>
                <strong>
                  {fmt12(start)} – {fmt12(end)}
                </strong>
                {minutes > 0 && <span className="note">Duration: {durationLabel(minutes)}</span>}
              </div>
            </div>
            <ErrorMessage error={error} />
            <button type="button" className="btn btn-primary btn-lg btn-block" onClick={onConfirm} disabled={busy || !space.data}>
              <Icon name="check_circle" size="sm" />
              Confirm Reservation
            </button>
            <Link to={`/spaces/${spaceId}`} className="btn btn-secondary btn-lg btn-block">
              <Icon name="arrow_back" size="sm" />
              Back / Change Time
            </Link>
          </div>
        </aside>
      </div>
    </section>
  )
}
