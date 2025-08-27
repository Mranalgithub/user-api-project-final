const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

async function req(path, opts = {}) {
  const res = await fetch(BASE + path, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const register = (payload) => req('/api/auth/register', { method: 'POST', body: JSON.stringify(payload) })
export const login = (payload) => req('/api/auth/login', { method: 'POST', body: JSON.stringify(payload) })
export const logout = () => req('/api/auth/logout', { method: 'POST', body: JSON.stringify({}) })
export const me = () => req('/api/user', { method: 'GET', headers: {} })
export const listFiles = () => req('/api/files', { method: 'GET' })

export async function uploadFile(file) {
  const formData = new FormData()
  formData.append('file', file)
  const res = await fetch(BASE + '/api/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Upload failed')
  return data
}
