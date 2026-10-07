import { Icon } from './ui.jsx'

export function ErrorMessage({ error, title, onDismiss }) {
  if (!error) return null
  return (
    <div role="alert" className="alert">
      <Icon name="error" fill />
      <div className="body">
        {title && <strong>{title}</strong>}
        <span>{error.message}</span>
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss">
          <Icon name="close" size="sm" />
        </button>
      )}
    </div>
  )
}

// Renders loading / error states; calls children(data) when ready.
export function Async({ state, children }) {
  if (state.loading)
    return (
      <div className="state" role="status">
        <span className="spinner" /> Loading…
      </div>
    )
  if (state.error) return <ErrorMessage error={state.error} />
  return children(state.data)
}
