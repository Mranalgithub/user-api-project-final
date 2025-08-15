import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Not authenticated')
      return
    }
    axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
      .then(res => setUsers(res.data))
      .catch(err => setMessage(err.response?.data?.error || 'Failed to fetch users'))
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/auth/logout', {}, { withCredentials: true })
    } catch (err) {
      console.error(err)
    } finally {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }

  return (
    <div>
      <h2>Dashboard</h2>
      {message && <p>{message}</p>}
      <button onClick={handleLogout}>Logout</button>
      <h3>Users</h3>
      <ul>
        {users.map(u => <li key={u._id || u.id}>{u.username}</li>)}
      </ul>
    </div>
  )
}
