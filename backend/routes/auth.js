const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendOTP } = require('../utils/emailService')

const router = express.Router()

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const otp = generateOTP()

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      otp,
      otpExpiry: new Date(Date.now() + 10 * 60000) // 10 minutes
    })

    await user.save()
    const emailSent = await sendOTP(email, otp)

    res.status(201).json({
      message: emailSent
        ? 'Signup successful. OTP sent to your email.'
        : 'Signup successful, but email failed to send. Check backend terminal for the code.',
      userId: user._id,
      debug_hint: 'Use 123456 for testing if needed'
    })
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message })
  }
})

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // For development, allow 123456 as a universal bypass
    const isDevelopment = process.env.NODE_ENV === 'development'
    const isBypass = isDevelopment && otp === '123456'

    if (!isBypass && (user.otp !== otp || new Date() > user.otpExpiry)) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    user.verified = true
    user.otp = null
    user.otpExpiry = null
    await user.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    res.json({
      message: 'OTP verified successfully',
      token,
      userId: user._id
    })
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { emailOrPhone } = req.body

    if (!emailOrPhone) {
      return res.status(400).json({ message: 'Email or phone is required' })
    }

    // Find user by email or phone
    const user = await User.findOne({
      $or: [{ email: emailOrPhone }, { phone: emailOrPhone }]
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }


    // Send OTP for login
    const otp = generateOTP()
    user.otp = otp
    user.otpExpiry = new Date(Date.now() + 10 * 60000)
    await user.save()
    const emailSent = await sendOTP(user.email, otp)

    res.json({
      message: emailSent
        ? 'OTP sent to your email.'
        : 'OTP generation successful, but email delivery failed. Check terminal.',
      userId: user._id,
      debug_hint: 'Use 123456 for testing'
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
})

module.exports = router
