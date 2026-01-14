import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsAPI, uploadAPI } from '../services/api'

// ProductImageCarousel Component
const ProductImageCarousel = ({ images, productName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [images]);

  if (!images || images.length === 0) {
    return <div className="image-placeholder">📦</div>;
  }

  return (
    <div className="product-image-carousel">
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="carousel-slide">
            <img src={`http://localhost:5000${img}`} alt={`${productName} - ${idx + 1}`} />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, idx) => (
            <button
              key={idx}
              className={`carousel-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(idx);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProductDashboard() {
  const navigate = useNavigate()
  // ... rest of state ...

  const [showAddProduct, setShowAddProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantityStock: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    images: [],
    exchangeReturn: 'Yes'
  })

  // Load products from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
      return
    }
    fetchProducts()
  }, [navigate])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      if (err.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('token')
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    console.log('Logging out...')
    navigate('/login')
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleBrowseClick = () => {
    const fileInput = document.getElementById('product-images')
    if (fileInput) fileInput.click()
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)

    if (files.length === 0) return

    try {
      setLoading(true)
      setError('')

      // Upload images to backend
      const response = await uploadAPI.uploadImages(files)

      // Add uploaded image URLs to formData
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...response.files]
      }))

      console.log('Images uploaded:', response.files)
    } catch (err) {
      console.error('Image upload error:', err)
      setError('Failed to upload images')
    } finally {
      setLoading(false)
    }
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')

    try {
      setLoading(true)

      const productData = {
        productName: formData.productName,
        productType: formData.productType,
        quantityStock: parseInt(formData.quantityStock) || 0,
        mrp: parseFloat(formData.mrp) || 0,
        sellingPrice: parseFloat(formData.sellingPrice) || 0,
        brandName: formData.brandName,
        images: formData.images,
        exchangeReturn: formData.exchangeReturn
      }

      if (editingProduct) {
        // Update existing product
        await productsAPI.update(editingProduct._id, productData)
        setSuccessMessage('Product updated successfully')
        setEditingProduct(null)
      } else {
        // Create new product
        await productsAPI.create(productData)
        setSuccessMessage('Product created successfully')
      }

      // Refresh products list
      await fetchProducts()

      console.log('Product saved successfully')
      setShowAddProduct(false)
      resetForm()
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Product save error:', err)
      setError(err.response?.data?.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const togglePublish = async (product) => {
    try {
      await productsAPI.toggleStatus(product._id)
      // Refresh products
      await fetchProducts()
    } catch (err) {
      console.error('Toggle status error:', err)
      setError('Failed to update product status')
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      productName: product.productName,
      productType: product.productType,
      quantityStock: product.quantityStock.toString(),
      mrp: product.mrp.toString(),
      sellingPrice: product.sellingPrice.toString(),
      brandName: product.brandName,
      images: product.images,
      exchangeReturn: product.exchangeReturn
    })
    setShowAddProduct(true)
  }

  const deleteProduct = (product) => {
    setProductToDelete(product)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!productToDelete) return

    try {
      await productsAPI.delete(productToDelete._id)
      setSuccessMessage('Product deleted successfully')
      await fetchProducts()
      setTimeout(() => setSuccessMessage(''), 3000)
      setDeleteModalOpen(false)
      setProductToDelete(null)
    } catch (err) {
      console.error('Delete product error:', err)
      setError('Failed to delete product')
      setDeleteModalOpen(false)
    }
  }

  const resetForm = () => {
    setFormData({
      productName: '',
      productType: '',
      quantityStock: '',
      mrp: '',
      sellingPrice: '',
      brandName: '',
      images: [],
      exchangeReturn: 'Yes'
    })
  }

  const closeModal = () => {
    setShowAddProduct(false)
    setEditingProduct(null)
    resetForm()
    setError('')
  }

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Productr</h2>
          <span className="logo-icon">🎯</span>
        </div>
        <div className="sidebar-search">
          <input type="text" placeholder="Search" />
        </div>
        <nav className="sidebar-nav">
          <a
            href="/home-dashboard"
            className="nav-item"
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a
            href="/product-dashboard"
            className="nav-item active"
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <span className="breadcrumb-icon">📦</span>
            <span className="breadcrumb">Products</span>
          </div>
          <div className="header-right profile-menu-container">
            <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <span className="profile-icon">👤</span>
            </button>
            {showProfileMenu && (
              <div className="profile-dropdown">
                <button className="profile-dropdown-item logout" onClick={handleLogout}>
                  <span>🚪</span> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Success Toast */}
        {successMessage && (
          <div className="success-toast">
            <div className="toast-icon">✓</div>
            <div className="toast-message">{successMessage}</div>
            <button className="toast-close" onClick={() => setSuccessMessage('')}>✕</button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && productToDelete && (
          <div className="delete-modal-overlay" onClick={() => setDeleteModalOpen(false)}>
            <div className="delete-modal-content" onClick={e => e.stopPropagation()}>
              <div className="delete-modal-header">
                <h2>Delete Product</h2>
                <button className="delete-modal-close" onClick={() => setDeleteModalOpen(false)}>✕</button>
              </div>
              <div className="delete-modal-body">
                <p>Are you sure you really want to delete this Product "<strong>{productToDelete.productName}</strong>" ?</p>
              </div>
              <div className="delete-modal-footer">
                <button className="btn-confirm-delete" onClick={confirmDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}

        <div className="products-container">
          {products.length > 0 && (
            <div className="products-header">
              <h2>Products</h2>
              <button className="btn-add-product-header" onClick={() => setShowAddProduct(true)}>+ Add Products</button>
            </div>
          )}



          {error && <div className="error-message" style={{ color: 'red', padding: '1rem', marginBottom: '1rem', backgroundColor: '#ffe6e6', borderRadius: '4px', margin: '0 2rem' }}>{error}</div>}

          {loading && !showAddProduct ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
          ) : products.length > 0 ? (
            <div className="products-grid">
              {products.map(product => (
                <div key={product._id} className="product-card">
                  <ProductImageCarousel
                    images={product.images}
                    productName={product.productName}
                  />
                  <div className="product-details">
                    <h3>{product.productName}</h3>
                    <p><span className="label">Product type</span> <span className="value">{product.productType || '-'}</span></p>
                    <p><span className="label">Quantity Stock</span> <span className="value">{product.quantityStock || '-'}</span></p>
                    <p><span className="label">MRP</span> <span className="value">₹ {product.mrp || '-'}</span></p>
                    <p><span className="label">Selling Price</span> <span className="value">₹ {product.sellingPrice || '-'}</span></p>
                    <p><span className="label">Brand Name</span> <span className="value">{product.brandName || '-'}</span></p>
                    <p><span className="label">Total Number of images</span> <span className="value">{product.images?.length || 0}</span></p>
                    <p><span className="label">Exchange Eligibility</span> <span className="value">{product.exchangeReturn}</span></p>
                  </div>
                  <div className="product-actions">
                    <button
                      className={`btn-status ${product.status === 'published' ? 'unpublish' : 'publish'}`}
                      onClick={() => togglePublish(product)}
                    >
                      {product.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="btn-edit" onClick={() => handleEditProduct(product)}>Edit</button>
                    <button className="btn-delete" onClick={() => deleteProduct(product)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-content">
              <div className="empty-state">
                <div className="empty-icon">📦✨</div>
                <h2>Feels a little empty over here...</h2>
                <p>You can create products without connecting store</p>
                <p className="empty-subtext">you can add products to store anytime</p>
                <button className="btn-add-product" onClick={() => setShowAddProduct(true)}>Add your Products</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAddProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

            {error && <div style={{ color: 'red', padding: '0.5rem', marginBottom: '1rem', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{error}</div>}

            <form onSubmit={handleCreateProduct} className="add-product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="CakeZone Walnut Brownie"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                >
                  <option value="">Select product type</option>
                  <option value="food">Food & Beverages</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Quantity Stock</label>
                <input
                  type="number"
                  name="quantityStock"
                  value={formData.quantityStock}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  placeholder="Maximum Retail Price"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="Selling Price"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Brand Name"
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label>Upload Product Images</label>
                <div className="upload-area">
                  <p>Upload product images</p>
                  <input
                    type="file"
                    id="product-images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                  <button type="button" className="btn-browse" onClick={handleBrowseClick} disabled={loading}>
                    {loading ? 'Uploading...' : 'Browse'}
                  </button>
                </div>
                {formData.images.length > 0 && (
                  <div className="uploaded-images">
                    <p className="uploaded-label">Uploaded Images ({formData.images.length})</p>
                    <div className="image-list">
                      {formData.images.map((imageUrl, index) => (
                        <div key={index} className="image-item">
                          <img src={`http://localhost:5000${imageUrl}`} alt={`Product ${index + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }} />
                          <span>{imageUrl.split('/').pop()}</span>
                          <button
                            type="button"
                            className="btn-remove"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Exchange or return eligibility</label>
                <select
                  name="exchangeReturn"
                  value={formData.exchangeReturn}
                  onChange={handleInputChange}
                  disabled={loading}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button type="submit" className="btn-create" disabled={loading}>
                {loading ? 'Saving...' : (editingProduct ? 'Save Changes' : 'Create')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
