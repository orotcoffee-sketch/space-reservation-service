import { request } from './client.js'

export const authApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: { email, password }, auth: false }),
  register: (email, password, name) =>
    request('/auth/register', { method: 'POST', body: { email, password, name }, auth: false }),
}

export const spacesApi = {
  list: () => request('/spaces'),
  get: (id) => request(`/spaces/${id}`),
  availability: (id, date) => request(`/spaces/${id}/availability?date=${encodeURIComponent(date)}`),
}

export const reservationsApi = {
  create: (body) => request('/reservations', { method: 'POST', body }),
  mine: () => request('/reservations/me'),
  get: (id) => request(`/reservations/${id}`),
  update: (id, body) => request(`/reservations/${id}`, { method: 'PUT', body }),
  cancel: (id) => request(`/reservations/${id}/cancel`, { method: 'PATCH' }),
}

export const adminApi = {
  spaces: () => request('/admin/spaces'),
  createSpace: (body) => request('/admin/spaces', { method: 'POST', body }),
  updateSpace: (id, body) => request(`/admin/spaces/${id}`, { method: 'PUT', body }),
  setSpaceStatus: (id, active) =>
    request(`/admin/spaces/${id}/status`, { method: 'PATCH', body: { active } }),
  reservations: () => request('/admin/reservations'),
}
