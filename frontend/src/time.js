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

export function todayString() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Backend returns HH:mm (tolerate HH:mm:ss).
export const hhmm = (t) => (t ? t.slice(0, 5) : '')
