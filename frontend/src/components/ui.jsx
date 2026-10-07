// Small presentational helpers shared by the pages (no data fetching, no business logic).

export function Icon({ name, size = '', fill = false }) {
  return (
    <span className={`icon ${size}${fill ? ' fill' : ''}`.trim()} aria-hidden="true">
      {name}
    </span>
  )
}

export function StatusBadge({ status }) {
  const kind = status === 'CONFIRMED' ? 'confirmed' : status === 'CANCELLED' ? 'cancelled' : 'inactive'
  return <span className={`pill ${kind}`}>{status}</span>
}

export function ActiveBadge({ active }) {
  return <span className={`pill ${active ? 'active' : 'inactive'}`}>{active ? 'Active' : 'Inactive'}</span>
}

// Space image from the API's imageUrl, or a neutral placeholder when there is none.
export function SpaceImage({ src }) {
  if (src) return <img src={src} alt="" loading="lazy" />
  return (
    <div className="media-empty">
      <Icon name="meeting_room" />
    </div>
  )
}

export function EmptyState({ icon = 'inbox', title, children, action }) {
  return (
    <div className="empty">
      <div className="tile">
        <Icon name={icon} size="lg" />
      </div>
      <h2>{title}</h2>
      {children && <p>{children}</p>}
      {action}
    </div>
  )
}
