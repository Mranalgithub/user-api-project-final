import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <nav>
        <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Signup />} />
      </Routes>
    </div>
  )
}
