const express = require('express')
const Product = require('../models/Product')
const verifyToken = require('../middleware/auth')

const router = express.Router()

// Create Product
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, images, exchangeReturn } = req.body

    const product = new Product({
      userId: req.userId,
      productName,
      productType,
      quantityStock,
      mrp,
      sellingPrice,
      brandName,
      images: images || [],
      exchangeReturn,
      status: 'unpublished'
    })

    await product.save()
    res.status(201).json({ message: 'Product created', product })
  } catch (error) {
    console.error('Create product error:', error)
    res.status(500).json({ message: 'Product creation failed', error: error.message })
  }
})

// Get all products for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.userId })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message })
  }
})

// Get product by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message })
  }
})

// Update Product
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { productName, productType, quantityStock, mrp, sellingPrice, brandName, images, exchangeReturn, status } = req.body

    const product = await Product.findOne({ _id: req.params.id, userId: req.userId })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.productName = productName || product.productName
    product.productType = productType || product.productType
    product.quantityStock = quantityStock !== undefined ? quantityStock : product.quantityStock
    product.mrp = mrp !== undefined ? mrp : product.mrp
    product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice
    product.brandName = brandName || product.brandName
    product.images = images || product.images
    product.exchangeReturn = exchangeReturn || product.exchangeReturn
    product.status = status || product.status
    product.updatedAt = new Date()

    await product.save()
    res.json({ message: 'Product updated', product })
  } catch (error) {
    res.status(500).json({ message: 'Product update failed', error: error.message })
  }
})

// Delete Product
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Product deletion failed', error: error.message })
  }
})

// Toggle publish/unpublish
router.patch('/:id/toggle-status', verifyToken, async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, userId: req.userId })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    product.status = product.status === 'published' ? 'unpublished' : 'published'
    product.updatedAt = new Date()
    await product.save()

    res.json({ message: 'Product status updated', product })
  } catch (error) {
    res.status(500).json({ message: 'Status update failed', error: error.message })
  }
})

module.exports = router
