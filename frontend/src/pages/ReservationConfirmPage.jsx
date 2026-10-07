import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { reservationsApi, spacesApi } from '../api/endpoints.js'
import { Async, ErrorMessage } from '../components/Status.jsx'
import { useLoad } from '../hooks.js'

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
      <p>
        Missing reservation details. <Link to="/spaces">Choose a space</Link>.
      </p>
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

  return (
    <section>
      <h1>Confirm reservation</h1>
      <Async state={space}>
        {(s) => (
          <dl>
            <dt>Space</dt>
            <dd>{s.name}</dd>
            <dt>Location</dt>
            <dd>{s.location}</dd>
            <dt>Date</dt>
            <dd>{date}</dd>
            <dt>Time</dt>
            <dd>
              {start} – {end}
            </dd>
          </dl>
        )}
      </Async>
      <ErrorMessage error={error} />
      <button type="button" onClick={onConfirm} disabled={busy || !space.data}>
        Confirm reservation
      </button>{' '}
      <Link to={`/spaces/${spaceId}`}>Back</Link>
    </section>
  )
}
