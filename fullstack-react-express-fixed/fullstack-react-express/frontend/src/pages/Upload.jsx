import { useState, useRef } from 'react'
import { uploadFile } from '../lib/api'

export default function Upload() {
  const [status, setStatus] = useState('')
  const [file, setFile] = useState(null)
  const drop = useRef(null)

  function onDrop(e) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f) setFile(f)
  }
  function onDragOver(e) { e.preventDefault() }

  async function onSubmit(e) {
    e.preventDefault()
    if (!file) return setStatus('Please choose a file')
    setStatus('Uploading...')
    try {
      const res = await uploadFile(file)
      setStatus('Uploaded: ' + res.filename)
    } catch (e) {
      setStatus('Error: ' + e.message)
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-xl font-semibold mb-4">Upload a file</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div ref={drop} onDrop={onDrop} onDragOver={onDragOver}
               className="border-2 border-dashed rounded-lg p-8 text-center text-slate-600">
            {file ? <span>Selected: <strong>{file.name}</strong></span> : 'Drag & drop a file here'}
          </div>
          <div>
            <input type="file" onChange={e=>setFile(e.target.files?.[0] || null)} />
          </div>
          <button className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700">Upload</button>
          {status && <p className="text-slate-700">{status}</p>}
        </form>
      </div>
    </div>
  )
}
