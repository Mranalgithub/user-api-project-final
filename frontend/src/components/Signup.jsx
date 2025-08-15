import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('http://localhost:5000/auth/signup', { username, password }, { withCredentials: true })
      const token = res.data.token
      if (token) localStorage.setItem('token', token)
      setMessage('Signup successful')
      navigate('/dashboard')
    } catch (err) {
      setMessage(err.response?.data?.error || (err.response?.data?.errors?.join(', ')) || 'Signup failed')
    }
  }

  return (
    <div>
      <h2>Signup</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="username" required />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="password" type="password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  )
}
