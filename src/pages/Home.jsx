import { useNavigate } from 'react-router-dom'
import runningImage from '../assets/Frame 2.png'

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="login-page">
      <div className="login-left">
        <img src={runningImage} alt="Running" className="login-image" />
      </div>
      <div className="login-right">
        <div className="login-form-container">
          <h1>Welcome</h1>
          <p className="welcome-subtitle">Get started with our application</p>
          <div className="home-buttons">
            <button className="btn-home" onClick={() => navigate('/login')}>
              Login
            </button>
            <button className="btn-home" onClick={() => navigate('/signup')}>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
