import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { reservationsApi } from '../api/endpoints.js'
import { Async, ErrorMessage } from '../components/Status.jsx'
import { useLoad } from '../hooks.js'
import { hhmm, TIME_OPTIONS } from '../time.js'

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
    <form onSubmit={onSubmit}>
      <label>
        Date
        <input type="date" required value={form.reservationDate} onChange={set('reservationDate')} />
      </label>
      <label>
        Start time
        <select value={form.startTime} onChange={set('startTime')}>
          {TIME_OPTIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label>
        End time
        <select value={form.endTime} onChange={set('endTime')}>
          {TIME_OPTIONS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <ErrorMessage error={error} />
      <button type="submit" disabled={busy}>
        Save
      </button>{' '}
      <button type="button" onClick={onCancel}>
        Discard
      </button>
    </form>
  )
}

export default function ReservationDetailPage() {
  const { id } = useParams()
  const state = useLoad(() => reservationsApi.get(id), [id])
  const [override, setOverride] = useState(null)
  const [editing, setEditing] = useState(false)
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
    <section>
      <h1>Reservation</h1>
      <Async state={state}>
        {(loaded) => {
          const r = override ?? loaded
          return (
            <>
              <dl>
                <dt>Space</dt>
                <dd>
                  {r.space.name} ({r.space.location})
                </dd>
                <dt>Date</dt>
                <dd>{r.reservationDate}</dd>
                <dt>Time</dt>
                <dd>
                  {hhmm(r.startTime)} – {hhmm(r.endTime)}
                </dd>
                <dt>Status</dt>
                <dd>{r.status}</dd>
              </dl>
              <ErrorMessage error={error} />
              {editing ? (
                <EditForm
                  reservation={r}
                  onCancel={() => setEditing(false)}
                  onSaved={(updated) => {
                    setOverride(updated)
                    setEditing(false)
                  }}
                />
              ) : (
                r.status === 'CONFIRMED' && (
                  <>
                    <button type="button" onClick={() => setEditing(true)}>
                      Modify
                    </button>{' '}
                    <button type="button" onClick={onCancel}>
                      Cancel reservation
                    </button>
                  </>
                )
              )}
            </>
          )
        }}
      </Async>
      <p>
        <Link to="/reservations">Back to my reservations</Link>
      </p>
    </section>
  )
}
