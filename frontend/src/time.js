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
