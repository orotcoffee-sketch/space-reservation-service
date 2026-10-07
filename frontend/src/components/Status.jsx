export function ErrorMessage({ error }) {
  if (!error) return null
  return (
    <p role="alert" className="error">
      {error.message}
    </p>
  )
}

// Renders loading / error states; calls children(data) when ready.
export function Async({ state, children }) {
  if (state.loading) return <p>Loading…</p>
  if (state.error) return <ErrorMessage error={state.error} />
  return children(state.data)
}
