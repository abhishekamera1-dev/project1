import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import otpImage from '../assets/Frame 2.png'
import { authAPI } from '../services/api'

export default function OTP() {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(120)

  // Get userId from location state or localStorage
  const userId = location.state?.userId || localStorage.getItem('pendingUserId')

  useEffect(() => {
    if (!userId) {
      // If no userId, redirect to login
      navigate('/login')
    }
  }, [userId, navigate])

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    setError('')

    // Auto move to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')

    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    try {
      setLoading(true)
      setError('')

      const response = await authAPI.verifyOTP(userId, otpCode)

      // Store token and userId
      localStorage.setItem('token', response.token)
      localStorage.setItem('userId', response.userId)
      localStorage.removeItem('pendingUserId')

      console.log('OTP verified successfully:', response)

      // Navigate to dashboard
      navigate('/home-dashboard')
    } catch (err) {
      console.error('OTP verification error:', err)
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setTimeLeft(120)
    setOtp(['', '', '', '', '', ''])
    setError('')

    // Resend OTP logic - call login/signup again if needed
    console.log('OTP Resent - Use 123456')
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={otpImage} alt="Productr" className="login-image" />
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
              <label htmlFor="otp-input-0">Enter OTP</label>
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength="1"
                    className="otp-input"
                    placeholder="-"
                  />
                ))}
              </div>
            </div>
            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? 'Verifying...' : 'Enter your OTP'}
            </button>
          </form>
          <div className="otp-footer">
            <p>Didn't receive OTP ?</p>
            <a href="#resend" onClick={handleResend}>Resend in {formatTime(timeLeft)}s</a>
          </div>
        </div>
      </div>
    </div>
  )
}
