import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import loginImage from '../assets/Frame 2.png'
import { authAPI } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    emailOrPhone: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      setLoading(true)
      const response = await authAPI.login(formData.emailOrPhone)

      // Store userId for OTP verification
      localStorage.setItem('pendingUserId', response.userId)
      localStorage.setItem('userEmail', formData.emailOrPhone)

      console.log('Login successful:', response)
      // Navigate to OTP page after login
      navigate('/otp', { state: { userId: response.userId, fromLogin: true } })
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={loginImage} alt="Productr" className="login-image" />
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h1>Login to your Productr Account</h1>
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
              <label htmlFor="emailOrPhone">Email or Phone number</label>
              <input
                type="text"
                id="emailOrPhone"
                name="emailOrPhone"
                value={formData.emailOrPhone}
                onChange={handleChange}
                required
                placeholder="Enter email or phone number"
                disabled={loading}
              />
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="signup-link">
            <p>Don't have a Productr Account</p>
            <a href="/signup">SignUp Here</a>
          </div>
        </div>
      </div>
    </div>
  )
}
