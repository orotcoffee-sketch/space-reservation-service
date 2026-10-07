export const pad = (n) => String(n).padStart(2, '0')

export function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number)
  return h * 60 + m
}

export function fromMinutes(min) {
  return `${pad(Math.floor(min / 60))}:${pad(min % 60)}`
}

// 30-minute aligned times 00:00..23:30
export const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => fromMinutes(i * 30))

// Business timezone (BR-014): reservation dates/times are interpreted in Asia/Seoul, not the browser zone.
const BUSINESS_TIME_ZONE = 'Asia/Seoul'
const seoulFormat = new Intl.DateTimeFormat('en-US', {
  timeZone: BUSINESS_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

function seoulNow() {
  const p = Object.fromEntries(seoulFormat.formatToParts(new Date()).map((x) => [x.type, x.value]))
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` }
}

export function todayString() {
  return seoulNow().date
}

// True when the start is not in the future in Asia/Seoul (matches the backend's BR-011 / BR-014 check).
export function isPastStart(date, startTime) {
  const now = seoulNow()
  const start = `${date} ${hhmm(startTime)}`
  return start <= `${now.date} ${now.time}`
}

// Backend returns HH:mm (tolerate HH:mm:ss).
export const hhmm = (t) => (t ? t.slice(0, 5) : '')

// ---- display helpers (presentation only; API values stay HH:mm / YYYY-MM-DD) ----

// 13:30 -> "01:30 PM"
export function fmt12(t) {
  const [h, m] = hhmm(t).split(':').map(Number)
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${pad(h12)}:${pad(m)} ${h >= 12 ? 'PM' : 'AM'}`
}

const utcDate = (date) => new Date(`${date}T00:00:00Z`)

export function addDays(date, n) {
  const d = utcDate(date)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

const dateText = (date, options) => utcDate(date).toLocaleDateString('en-US', { timeZone: 'UTC', ...options })

// "Friday, October 25, 2024"
export const fmtDateLong = (date) => dateText(date, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
// "Oct 25, 2024"
export const fmtDateShort = (date) => dateText(date, { year: 'numeric', month: 'short', day: 'numeric' })
// { top: "Fri", bottom: "Oct 25" }
export const fmtDateChip = (date) => ({
  top: dateText(date, { weekday: 'short' }),
  bottom: dateText(date, { month: 'short', day: 'numeric' }),
})

export const durationMinutes = (start, end) => toMinutes(hhmm(end)) - toMinutes(hhmm(start))

// 90 -> "1 hr 30 min"
export function durationLabel(minutes) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return [h ? `${h} hr` : '', m ? `${m} min` : ''].filter(Boolean).join(' ')
}
