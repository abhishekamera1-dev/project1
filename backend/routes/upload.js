const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const router = express.Router()

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir)
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname))
    }
})

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(new Error('Only image files are allowed!'))
    }
}

// Configure multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
})

// Upload multiple images
router.post('/upload', upload.array('images', 10), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' })
        }

        const fileUrls = req.files.map(file => `/uploads/${file.filename}`)

        res.json({
            message: 'Images uploaded successfully',
            files: fileUrls
        })
    } catch (error) {
        res.status(500).json({ message: 'Upload failed', error: error.message })
    }
})

// Delete image
router.delete('/delete/:filename', (req, res) => {
    try {
        const filename = req.params.filename
        const filePath = path.join(uploadsDir, filename)

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            res.json({ message: 'Image deleted successfully' })
        } else {
            res.status(404).json({ message: 'File not found' })
        }
    } catch (error) {
        res.status(500).json({ message: 'Delete failed', error: error.message })
    }
})

module.exports = router
