import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { productsAPI } from '../services/api'

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

export default function HomeDashboard() {
  const navigate = useNavigate()
  // ... rest of state ...

  const [activeTab, setActiveTab] = useState('published')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    productName: '',
    productType: '',
    quantityStock: '',
    mrp: '',
    sellingPrice: '',
    brandName: '',
    exchangeReturn: 'Yes'
  })

  // Load products from backend
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productsAPI.getAll()
      setProducts(data)
    } catch (err) {
      console.error('Error fetching products:', err)
      if (err.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const filteredProducts = products.filter(p => p.status === activeTab)



  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Keep specific button handler for explicit unpublish button too
  const togglePublish = async (e, productId) => {
    e.stopPropagation() // Prevent triggering card click
    try {
      await productsAPI.toggleStatus(productId)
      await fetchProducts()
    } catch (err) {
      console.error('Error toggling status:', err)
      setError('Failed to update status')
    }
  }

  const deleteProduct = (e, product) => {
    e.stopPropagation()
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
      console.error('Error deleting product:', err)
      setError('Failed to delete product')
      setDeleteModalOpen(false)
    }
  }

  const handleEditProduct = (e, product) => {
    e.stopPropagation() // Prevent triggering card click
    setEditingProduct(product)
    setFormData({
      productName: product.productName,
      productType: product.productType,
      quantityStock: product.quantityStock,
      mrp: product.mrp,
      sellingPrice: product.sellingPrice,
      brandName: product.brandName,
      exchangeReturn: product.exchangeReturn
    })
    setShowEditModal(true)
  }

  const handleSaveProduct = async (e) => {
    e.preventDefault()
    try {
      const productData = {
        ...formData,
        quantityStock: parseInt(formData.quantityStock),
        mrp: parseFloat(formData.mrp),
        sellingPrice: parseFloat(formData.sellingPrice)
      }

      await productsAPI.update(editingProduct._id, productData)
      setSuccessMessage('Product updated successfully')
      await fetchProducts()
      setShowEditModal(false)
      setEditingProduct(null)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error updating product:', err)
      setError('Failed to update product')
    }
  }

  const closeEditModal = () => {
    setShowEditModal(false)
    setEditingProduct(null)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    navigate('/login')
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
            className="nav-item active"
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a
            href="/product-dashboard"
            className="nav-item"
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <span className="breadcrumb-icon">🏠</span>
            <span className="breadcrumb">Home</span>
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

        <div className="products-container" style={{ overflowY: 'auto' }}>
          <div className="products-tabs">
            <button
              className={`tab ${activeTab === 'published' ? 'active' : ''}`}
              onClick={() => setActiveTab('published')}
            >
              Published
            </button>
            <button
              className={`tab ${activeTab === 'unpublished' ? 'active' : ''}`}
              onClick={() => setActiveTab('unpublished')}
            >
              Unpublished
            </button>
          </div>

          {error && <div className="error-message" style={{ margin: '1rem', color: 'red' }}>{error}</div>}

          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
          ) : filteredProducts.length > 0 ? (
            <div className="products-grid" style={{ padding: '2rem' }}>
              {filteredProducts.map(product => (
                <div
                  key={product._id}
                  className="product-card"
                  style={{ border: '1px solid #eee', transition: 'transform 0.2s' }}
                >
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
                      onClick={(e) => togglePublish(e, product._id)}
                    >
                      {product.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button className="btn-edit" onClick={(e) => handleEditProduct(e, product)}>Edit</button>
                    <button className="btn-delete" onClick={(e) => deleteProduct(e, product)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-content">
              <div className="empty-state">
                <div className="empty-icon">📦✨</div>
                <h2>No {activeTab === 'published' ? 'Published' : 'Unpublished'} Products</h2>
                <p>Your {activeTab.toLowerCase()} products will appear here</p>
                <p className="empty-subtext">Go to Products page to add new items</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showEditModal && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Product</h2>
              <button className="modal-close" onClick={closeEditModal}>✕</button>
            </div>

            <form onSubmit={handleSaveProduct} className="add-product-form">
              <div className="form-group">
                <label>Product Name</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Product Type</label>
                <select
                  name="productType"
                  value={formData.productType}
                  onChange={handleInputChange}
                  required
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
                />
              </div>

              <div className="form-group">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Exchange or return eligibility</label>
                <select
                  name="exchangeReturn"
                  value={formData.exchangeReturn}
                  onChange={handleInputChange}
                >
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              <button type="submit" className="btn-create">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}