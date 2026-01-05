import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Leases() {
  const [items, setItems] = useState([])

  useEffect(() => {
    api.get('/leases/me').then((res) => setItems(res.data))
  }, [])

  return (
    <div className="sr-card">
      <h1 className="sr-card-title">My Leases</h1>
      <p className="sr-card-subtitle">
        Active, pending and completed rental agreements.
      </p>

      {items.length === 0 ? (
        <p className="sr-card-subtitle" style={{ marginTop: 8 }}>
          No leases yet.
        </p>
      ) : (
        <ul className="sr-list">
          {items.map((l) => (
            <li key={l._id} className="sr-list-item">
              <span>
                {l.property?.title}{' '}
                <span style={{ color: 'var(--sr-muted)', fontSize: '0.8rem' }}>
                  • {l.property?.city}
                </span>
              </span>
              <span className="sr-pill sr-pill-amber">{l.status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}