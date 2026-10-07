import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { spacesApi } from '../api/endpoints.js'
import { Async } from '../components/Status.jsx'
import { Icon, SpaceImage } from '../components/ui.jsx'
import { useLoad } from '../hooks.js'
import {
  addDays,
  durationLabel,
  fmt12,
  fmtDateChip,
  fmtDateShort,
  fromMinutes,
  hhmm,
  isPastStart,
  toMinutes,
  todayString,
} from '../time.js'

const STEP = 30
const LAST_START = 23 * 60 // a slot starting at 23:30 would end at 24:00, which HH:mm cannot express
const SLOT_STARTS = Array.from({ length: 48 }, (_, i) => i * STEP)
const DATE_CHIP_COUNT = 7

export default function SpaceDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const space = useLoad(() => spacesApi.get(id), [id])
  const today = todayString()
  const [date, setDate] = useState(today)
  const availability = useLoad(() => (date ? spacesApi.availability(id, date) : Promise.resolve(null)), [id, date])
  const [sel, setSel] = useState(null) // { start, end } in minutes

  // Hint only: the backend remains authoritative for availability/conflicts.
  const ranges = useMemo(
    () =>
      (availability.data?.reservedRanges ?? []).map((r) => [toMinutes(hhmm(r.startTime)), toMinutes(hhmm(r.endTime))]),
    [availability.data],
  )

  const slotState = (m) => {
    if (m > LAST_START) return 'unavailable'
    if (ranges.some(([s, e]) => m < e && m + STEP > s)) return 'booked'
    if (date === today && isPastStart(date, fromMinutes(m))) return 'unavailable'
    return 'free'
  }

  function onDate(next) {
    setDate(next)
    setSel(null)
  }

  function onSlot(m) {
    setSel((cur) => {
      if (cur && cur.end - cur.start === STEP && m === cur.start) return null
      if (cur && m >= cur.end) {
        // extend the range only across a contiguous run of free slots
        for (let x = cur.start; x <= m; x += STEP) if (slotState(x) !== 'free') return { start: m, end: m + STEP }
        return { start: cur.start, end: m + STEP }
      }
      return { start: m, end: m + STEP }
    })
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!sel) return
    const q = new URLSearchParams({ spaceId: id, date, start: fromMinutes(sel.start), end: fromMinutes(sel.end) })
    navigate(`/reservations/new?${q}`)
  }

  const chipDates = Array.from({ length: DATE_CHIP_COUNT }, (_, i) => addDays(today, i))
  const inactive = space.data?.active === false

  return (
    <section>
      <Link to="/spaces" className="backlink">
        <Icon name="arrow_back" size="sm" />
        Back to Spaces
      </Link>
      <div className="detail-layout">
        <div>
          <Async state={space}>
            {(s) => (
              <>
                <div className="detail-hero">
                  <SpaceImage src={s.imageUrl} />
                  <div className="chips">
                    <span className="chip-info">
                      <Icon name="group" />
                      {s.capacity} seats
                    </span>
                    <span className="chip-info">
                      <Icon name="location_on" />
                      {s.location}
                    </span>
                  </div>
                </div>
                <h1 className="detail-title">{s.name}</h1>
                <p className="detail-desc">{s.description}</p>
                {s.active === false && (
                  <div role="alert" className="alert" style={{ marginTop: '1rem' }}>
                    <Icon name="block" fill />
                    <div className="body">This space is inactive and cannot be reserved.</div>
                  </div>
                )}
              </>
            )}
          </Async>
        </div>

        <form className="side" onSubmit={onSubmit}>
          <h2 className="section-title" style={{ marginTop: 0 }}>
            Select Slot
          </h2>
          <div className="datechips" role="group" aria-label="Quick dates">
            {chipDates.map((d, i) => {
              const c = fmtDateChip(d)
              return (
                <button key={d} type="button" className={`datechip${d === date ? ' on' : ''}`} onClick={() => onDate(d)}>
                  <small>{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : c.top}</small>
                  <span>{c.bottom}</span>
                </button>
              )
            })}
          </div>
          <div className="date-other">
            <label htmlFor="slot-date">Other date</label>
            <input
              id="slot-date"
              className="input"
              type="date"
              required
              min={today}
              value={date}
              onChange={(e) => onDate(e.target.value)}
            />
          </div>

          <Async state={availability}>
            {() => (
              <>
                <div className="legend">
                  <span>
                    <i /> Available
                  </span>
                  <span>
                    <i className="sel" /> Selected
                  </span>
                  <span>
                    <i className="bk" /> Booked
                  </span>
                </div>
                <div className="slot-grid" role="group" aria-label="Time slots">
                  {SLOT_STARTS.map((m) => {
                    const st = slotState(m)
                    const selected = sel && m >= sel.start && m < sel.end
                    const cls = ['slot', st === 'free' ? '' : st, selected ? 'sel' : '', selected && m === sel.start ? 'edge' : '']
                      .filter(Boolean)
                      .join(' ')
                    return (
                      <button
                        key={m}
                        type="button"
                        className={cls}
                        disabled={st !== 'free'}
                        aria-pressed={!!selected}
                        onClick={() => onSlot(m)}
                      >
                        {fmt12(fromMinutes(m))}
                      </button>
                    )
                  })}
                </div>
                <p className="hint" style={{ marginTop: '0.75rem' }}>
                  Tap a start slot, then a later slot to extend. 30-minute steps.
                </p>
              </>
            )}
          </Async>

          {sel && (
            <div className="allocation">
              <div className="row">
                <div className="ico">
                  <Icon name="schedule" />
                </div>
                <div>
                  <small>Slot allocation</small>
                  <span className="big">{durationLabel(sel.end - sel.start)} duration</span>
                </div>
              </div>
              <div className="times">
                <div>
                  <small>Start Time</small>
                  <strong>{fmt12(fromMinutes(sel.start))}</strong>
                </div>
                <Icon name="arrow_forward" />
                <div className="end">
                  <small>End Time</small>
                  <strong>{fmt12(fromMinutes(sel.end))}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="reserve-bar">
            <div className="txt">
              <small>{sel ? `${fmtDateShort(date)} • ${fmt12(fromMinutes(sel.start))} – ${fmt12(fromMinutes(sel.end))}` : 'No time selected'}</small>
              <strong>{space.data?.name ?? 'Reserve'}</strong>
            </div>
            <button type="submit" className="btn btn-primary btn-lg" disabled={!date || !sel || inactive}>
              Reserve Space
              <Icon name="check_circle" size="sm" />
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
