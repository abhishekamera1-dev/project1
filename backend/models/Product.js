const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productType: {
    type: String,
    required: true
  },
  quantityStock: {
    type: Number,
    default: 0
  },
  mrp: {
    type: Number,
    default: 0
  },
  sellingPrice: {
    type: Number,
    default: 0
  },
  brandName: {
    type: String,
    default: ''
  },
  images: {
    type: [String],
    default: []
  },
  exchangeReturn: {
    type: String,
    enum: ['Yes', 'No'],
    default: 'Yes'
  },
  status: {
    type: String,
    enum: ['published', 'unpublished'],
    default: 'unpublished'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Product', productSchema)
