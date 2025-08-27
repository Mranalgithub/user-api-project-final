import { useEffect, useState } from 'react'
import { listFiles } from '../lib/api'
import { Link } from 'react-router-dom'

export default function Dashboard({ user }) {
  const [files, setFiles] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await listFiles()
        setFiles(res)
      } catch (e) {
        setError(e.message)
      }
    })()
  }, [])

  return (
    <div className="space-y-4">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-1">Dashboard</h1>
        <p className="text-slate-600">Welcome back, <span className="font-medium">{user?.name}</span></p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Your files</h2>
          <Link to="/upload" className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">Upload</Link>
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {files.length === 0 ? <p className="text-slate-500">No files yet.</p> :
          <ul className="list-disc pl-5">
            {files.map(f => (
              <li key={f.name}>
                <a className="text-blue-700 underline" href={f.url} target="_blank" rel="noreferrer">{f.name}</a>
              </li>
            ))}
          </ul>
        }
      </div>
    </div>
  )
}
