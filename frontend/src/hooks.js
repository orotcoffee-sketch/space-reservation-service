/* oxlint-disable react-hooks/exhaustive-deps -- deps are supplied by the caller */
import { useEffect, useState } from 'react'

// Runs an async loader on mount / when deps change; exposes data, error and loading state.
export function useLoad(loader, deps) {
  const [state, setState] = useState({ data: null, error: null, loading: true })
  useEffect(() => {
    let cancelled = false
    setState((s) => ({ ...s, loading: true, error: null }))
    loader().then(
      (data) => !cancelled && setState({ data, error: null, loading: false }),
      (error) => !cancelled && setState({ data: null, error, loading: false }),
    )
    return () => {
      cancelled = true
    }
  }, deps)
  return state
}
