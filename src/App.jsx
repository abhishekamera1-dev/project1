import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import OTP from './pages/OTP'
import HomeDashboard from './pages/HomeDashboard'
import ProductDashboard from './pages/ProductDashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/home-dashboard" element={<HomeDashboard />} />
        <Route path="/product-dashboard" element={<ProductDashboard />} />
        <Route path="/dashboard" element={<HomeDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
