import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { reservationsApi } from '../api/endpoints.js'
import { Async, ErrorMessage } from '../components/Status.jsx'
import { Icon, StatusBadge } from '../components/ui.jsx'
import { useLoad } from '../hooks.js'
import { durationLabel, durationMinutes, fmt12, fmtDateLong, hhmm, isPastStart, TIME_OPTIONS } from '../time.js'

function EditForm({ reservation, onSaved, onCancel }) {
  const [form, setForm] = useState({
    reservationDate: reservation.reservationDate,
    startTime: hhmm(reservation.startTime),
    endTime: hhmm(reservation.endTime),
  })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      onSaved(await reservationsApi.update(reservation.id, form))
    } catch (err) {
      setError(err)
      setBusy(false)
    }
  }

  return (
    <form className="edit-panel" onSubmit={onSubmit}>
      <h3>Modify Time Slot</h3>
      <div className="form-grid">
        <div className="field">
          <label htmlFor="edit-date">Date</label>
          <input id="edit-date" className="input" type="date" required value={form.reservationDate} onChange={set('reservationDate')} />
        </div>
        <div className="field">
          <label htmlFor="edit-start">Start time</label>
          <select id="edit-start" className="select" style={{ width: '100%' }} value={form.startTime} onChange={set('startTime')}>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {fmt12(t)}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="edit-end">End time</label>
          <select id="edit-end" className="select" style={{ width: '100%' }} value={form.endTime} onChange={set('endTime')}>
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {fmt12(t)}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ErrorMessage error={error} />
      <div className="actions">
        <button type="submit" className="btn btn-primary" disabled={busy}>
          Save
        </button>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Discard
        </button>
      </div>
    </form>
  )
}

export default function ReservationDetailPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const state = useLoad(() => reservationsApi.get(id), [id])
  const [override, setOverride] = useState(null)
  const [editing, setEditing] = useState(params.get('edit') === '1')
  const [error, setError] = useState(null)

  async function onCancel() {
    if (!window.confirm('Cancel this reservation?')) return
    setError(null)
    try {
      setOverride(await reservationsApi.cancel(id))
    } catch (err) {
      setError(err)
    }
  }

  return (
    <section className="detail-narrow">
      <Link to="/reservations" className="backlink">
        <Icon name="arrow_back" size="sm" />
        Back to My Reservations
      </Link>
      <Async state={state}>
        {(loaded) => {
          const r = override ?? loaded
          // Past (start not in the future, Asia/Seoul) and cancelled reservations are read-only.
          const modifiable = r.status === 'CONFIRMED' && !isPastStart(r.reservationDate, r.startTime)
          const minutes = durationMinutes(r.startTime, r.endTime)
          return (
            <>
              <div className="title-between">
                <h1>Reservation #{r.id}</h1>
                <StatusBadge status={r.status} />
              </div>
              <div className="card card-pad">
                <div className="res-head">
                  <div className="thumb">
                    <Icon name="meeting_room" />
                  </div>
                  <div>
                    <h2>{r.space.name}</h2>
                    <div className="loc">
                      <Icon name="location_on" size="sm" />
                      {r.space.location}
                    </div>
                  </div>
                </div>
                <div className="two-up">
                  <div className="big-tile">
                    <div className="ico">
                      <Icon name="calendar_month" />
                    </div>
                    <div>
                      <small>Date</small>
                      <strong>{fmtDateLong(r.reservationDate)}</strong>
                    </div>
                  </div>
                  <div className="big-tile">
                    <div className="ico">
                      <Icon name="schedule" />
                    </div>
                    <div>
                      <small>Time</small>
                      <strong>
                        {fmt12(r.startTime)} – {fmt12(r.endTime)}
                      </strong>
                      {minutes > 0 && <div className="note">Total Duration: {durationLabel(minutes)}</div>}
                    </div>
                  </div>
                </div>
                <ErrorMessage error={error} />
                {editing && modifiable ? (
                  <EditForm
                    reservation={r}
                    onCancel={() => setEditing(false)}
                    onSaved={(updated) => {
                      setOverride(updated)
                      setEditing(false)
                    }}
                  />
                ) : modifiable ? (
                  <div className="actions">
                    <button type="button" className="btn btn-secondary btn-lg" onClick={() => setEditing(true)}>
                      <Icon name="edit_calendar" size="sm" />
                      Modify Time Slot
                    </button>
                    <button type="button" className="btn btn-danger btn-lg" onClick={onCancel}>
                      <Icon name="cancel" size="sm" />
                      Cancel Reservation
                    </button>
                  </div>
                ) : (
                  <p className="readonly-note">
                    {r.status === 'CANCELLED' ? 'This reservation was cancelled and is read-only.' : 'Past reservation (Read-only).'}
                  </p>
                )}
              </div>
            </>
          )
        }}
      </Async>
    </section>
  )
}
