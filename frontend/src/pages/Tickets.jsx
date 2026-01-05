import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Tickets() {
  const [items, setItems] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    api.get('/tickets').then((res) => setItems(res.data))
  }, [])

  const submit = async (e) => {
    e.preventDefault()
    const { data } = await api.post('/tickets', { title, description })
    setItems([data, ...items])
    setTitle('')
    setDescription('')
  }

  return (
    <div className="sr-card">
      <h1 className="sr-card-title">Maintenance Tickets</h1>
      <p className="sr-card-subtitle">
        Report and track issues in your rental.
      </p>

      <form className="sr-form" onSubmit={submit} style={{ marginTop: 12 }}>
        <div className="sr-form-row">
          <label className="sr-label">Title</label>
          <input
            className="sr-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: Kitchen sink leakage"
          />
        </div>
        <div className="sr-form-row">
          <label className="sr-label">Description</label>
          <textarea
            className="sr-textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details so your landlord can resolve it quickly."
          />
        </div>
        <button className="sr-btn sr-btn-primary" type="submit">
          Create ticket
        </button>
      </form>

      <ul className="sr-list">
        {items.map((t) => (
          <li key={t._id} className="sr-list-item">
            <span>{t.title}</span>
            <span className="sr-pill sr-pill-slate">{t.status}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}