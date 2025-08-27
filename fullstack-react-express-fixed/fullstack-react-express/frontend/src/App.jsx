import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Upload from './pages/Upload'
import { useEffect, useState } from 'react'
import { me } from './lib/api'

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    me().then(res => { setUser(res.user || null) }).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen">
      <Navbar user={user} setUser={setUser} />
      <div className="max-w-3xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
          <Route path="/upload" element={user ? <Upload /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  )
}
