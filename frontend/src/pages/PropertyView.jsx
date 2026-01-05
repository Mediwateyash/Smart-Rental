import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/axios'

export default function PropertyView() {
  const { id } = useParams()
  const [property, setProperty] = useState(null)

  useEffect(() => {
    api.get(`/properties/${id}`).then((res) => setProperty(res.data))
  }, [id])

  if (!property) return <div className="sr-card">Loading...</div>

  return (
    <div className="sr-card">
      <div className="sr-card-header">
        <h1 className="sr-card-title">{property.title}</h1>
        <span className="sr-tag">{property.city}</span>
      </div>

      <p className="sr-card-subtitle" style={{ marginBottom: 12 }}>
        {property.address}
      </p>

      <p style={{ marginBottom: 8 }}>
        <strong>Rent:</strong> ₹{property.rent}/month
      </p>
      <p style={{ marginBottom: 8 }}>
        <strong>Layout:</strong> {property.bedrooms} BR / {property.bathrooms} BA
      </p>
      <p style={{ marginBottom: 8 }}>
        <strong>Owner:</strong> {property.owner?.name} ({property.owner?.email})
      </p>
    </div>
  )
}