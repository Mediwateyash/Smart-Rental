import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('tenant')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        role
      })
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
    <div className="sr-auth-wrapper">
      <div className="sr-card">
        <h1 className="sr-page-title">Create account</h1>
        <p className="sr-page-subtitle">
          Choose tenant or landlord to get the right dashboard.
        </p>

        {error && <p className="sr-error">{error}</p>}

        <form className="sr-form" onSubmit={submit}>
          <div className="sr-form-row">
            <label className="sr-label">Full name</label>
            <input
              className="sr-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="sr-form-row">
            <label className="sr-label">Email</label>
            <input
              className="sr-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>

          <div className="sr-form-row">
            <label className="sr-label">Password</label>
            <input
              className="sr-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="sr-form-row">
            <label className="sr-label">Role</label>
            <select
              className="sr-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>

          <button className="sr-btn sr-btn-primary" type="submit">
            Register
          </button>
        </form>
      </div>
    </div>
  )
}