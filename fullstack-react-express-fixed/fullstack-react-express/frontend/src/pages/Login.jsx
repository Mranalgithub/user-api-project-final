import { useState } from 'react'
import { login, me } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Login({ setUser }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await login({ email, password })
      const res = await me()
      setUser(res.user || null)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded-md px-3 py-2" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
          <input className="w-full border rounded-md px-3 py-2" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button disabled={loading} className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700 disabled:opacity-50">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
