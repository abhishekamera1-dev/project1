import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import signupImage from '../assets/Frame 2.png'
import { authAPI } from '../services/api'

export default function Signup() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('') // Clear error on input change
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    try {
      setLoading(true)
      const response = await authAPI.signup(formData.email, formData.password)

      // Store userId for OTP verification
      localStorage.setItem('pendingUserId', response.userId)
      localStorage.setItem('userEmail', formData.email)

      console.log('Signup successful:', response)
      // Navigate to OTP page after signup
      navigate('/otp', { state: { userId: response.userId, fromSignup: true } })
    } catch (err) {
      console.error('Signup error:', err)
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-left">
        <img src={signupImage} alt="Productr" className="signup-image" />
      </div>
      <div className="signup-right">
        <div className="signup-form-container">
          <h1>Sign Up to Productr</h1>
          {error && (
            <div style={{
              color: '#d32f2f',
              backgroundColor: '#ffebee',
              padding: '12px',
              borderRadius: '6px',
              marginBottom: '1rem',
              border: '1px solid #ef9a9a',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-signup" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <div className="signup-link">
            <p>Already have an account?</p>
            <a href="/login">Login Here</a>
          </div>
        </div>
      </div>
    </div>
  )
}
