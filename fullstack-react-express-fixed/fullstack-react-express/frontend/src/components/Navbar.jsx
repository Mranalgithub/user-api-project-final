import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../lib/api'

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      setUser(null)
      navigate('/')
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-semibold">Fullstack App</Link>
        <div className="flex items-center gap-4">
          {!user && <>
            <Link to="/login" className="text-slate-700 hover:text-slate-900">Login</Link>
            <Link to="/register" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">Register</Link>
          </>}
          {user && <>
            <Link to="/dashboard" className="text-slate-700 hover:text-slate-900">Dashboard</Link>
            <Link to="/upload" className="text-slate-700 hover:text-slate-900">Upload</Link>
            <button onClick={handleLogout} className="text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded-md">Logout</button>
          </>}
        </div>
      </div>
    </nav>
  )
}
