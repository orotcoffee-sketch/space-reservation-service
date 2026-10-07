import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { spacesApi } from '../api/endpoints.js'
import { Async } from '../components/Status.jsx'
import { useLoad } from '../hooks.js'
import { fromMinutes, hhmm, TIME_OPTIONS, toMinutes, todayString } from '../time.js'

const STEP = 30
const LAST_END = 23 * 60 + 30 // end must stay on the same calendar date (HH:mm cannot express 24:00)

export default function SpaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const space = useLoad(() => spacesApi.get(id), [id])
  const [date, setDate] = useState(todayString())
  const availability = useLoad(() => (date ? spacesApi.availability(id, date) : Promise.resolve(null)), [id, date])
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  // Hint only: the backend remains authoritative for availability/conflicts.
  const ranges = useMemo(
    () =>
      (availability.data?.reservedRanges ?? []).map((r) => [toMinutes(hhmm(r.startTime)), toMinutes(hhmm(r.endTime))]),
    [availability.data],
  )
  const isFree = (slotStart) => !ranges.some(([s, e]) => slotStart < e && slotStart + STEP > s)
  const startOptions = TIME_OPTIONS.filter((t) => isFree(toMinutes(t)))
  const endOptions = []
  if (start) {
    for (let m = toMinutes(start); m < LAST_END && isFree(m); m += STEP) endOptions.push(fromMinutes(m + STEP))
  }

  function onDate(e) {
    setDate(e.target.value)
    setStart('')
    setEnd('')
  }

  function onStart(e) {
    setStart(e.target.value)
    setEnd('')
  }

  function onSubmit(e) {
    e.preventDefault()
    const q = new URLSearchParams({ spaceId: id, date, start, end })
    navigate(`/reservations/new?${q}`)
  }

  return (
    <section className="detail">
      <Async state={space}>
        {(s) => (
          <>
            <h1>{s.name}</h1>
            {s.imageUrl && <img src={s.imageUrl} alt="" />}
            <p>{s.description}</p>
            <p>Location: {s.location}</p>
            <p>Capacity: {s.capacity}</p>
            {s.active === false && <p className="error">This space is inactive and cannot be reserved.</p>}
          </>
        )}
      </Async>

      <h2>Reserve</h2>
      <form onSubmit={onSubmit}>
        <label>
          Date
          <input type="date" required min={todayString()} value={date} onChange={onDate} />
        </label>
        <Async state={availability}>
          {() => (
            <>
              {ranges.length > 0 && (
                <p>
                  Already reserved:{' '}
                  {ranges.map(([s, e]) => `${fromMinutes(s)}–${fromMinutes(e)}`).join(', ')}
                </p>
              )}
              <label>
                Start time
                <select required value={start} onChange={onStart}>
                  <option value="">Select…</option>
                  {startOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label>
                End time
                <select required value={end} onChange={(e) => setEnd(e.target.value)} disabled={!start}>
                  <option value="">Select…</option>
                  {endOptions.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
            </>
          )}
        </Async>
        <button type="submit" disabled={!date || !start || !end}>
          Continue
        </button>
      </form>
    </section>
  )
}
