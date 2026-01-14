import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const navigate = useNavigate()
  const [activePage, setActivePage] = useState('home')
  const [activeTab, setActiveTab] = useState('Published')
  const [showAddProduct, setShowAddProduct] = useState(false)
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

  const handleLogout = () => {
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
    console.log('Browse files')
  }

  const handleCreateProduct = (e) => {
    e.preventDefault()
    console.log('Creating product:', formData)
    setShowAddProduct(false)
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
  }

  const handleAddProductClick = () => {
    if (activePage === 'home') {
      setActivePage('products')
      setShowAddProduct(true)
    } else {
      setShowAddProduct(true)
    }
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
            href="#home" 
            className={`nav-item ${activePage === 'home' ? 'active' : ''}`}
            onClick={() => setActivePage('home')}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </a>
          <a 
            href="#products" 
            className={`nav-item ${activePage === 'products' ? 'active' : ''}`}
            onClick={() => setActivePage('products')}
          >
            <span className="nav-icon">📦</span>
            <span>Products</span>
          </a>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <span className="breadcrumb-icon">{activePage === 'home' ? '🏠' : '📦'}</span>
            <span className="breadcrumb">{activePage === 'home' ? 'Home' : 'Products'}</span>
          </div>
          <div className="header-right">
            <button className="profile-btn" onClick={handleLogout}>
              <span className="profile-icon">👤</span>
            </button>
          </div>
        </header>

        <div className="products-container">
          <div className="products-tabs">
            <button 
              className={`tab ${activeTab === 'Published' ? 'active' : ''}`}
              onClick={() => setActiveTab('Published')}
            >
              Published
            </button>
            <button 
              className={`tab ${activeTab === 'Unpublished' ? 'active' : ''}`}
              onClick={() => setActiveTab('Unpublished')}
            >
              Unpublished
            </button>
          </div>

          <div className="dashboard-content">
            <div className="empty-state">
              <div className="empty-icon">📦✨</div>
              {activePage === 'home' ? (
                <>
                  <h2>No {activeTab} Products</h2>
                  <p>Your {activeTab.toLowerCase()} products will appear here</p>
                  <p className="empty-subtext">Create your first product to publish</p>
                </>
              ) : (
                <>
                  <h2>Feels a little empty over here...</h2>
                  <p>You can create products without connecting store</p>
                  <p className="empty-subtext">you can add products to store anytime</p>
                  <button className="btn-add-product" onClick={handleAddProductClick}>Add your Products</button>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {showAddProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Product</h2>
              <button className="modal-close" onClick={closeModal}>✕</button>
            </div>

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
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>MRP</label>
                <input
                  type="number"
                  name="mrp"
                  value={formData.mrp}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Selling Price</label>
                <input
                  type="number"
                  name="sellingPrice"
                  value={formData.sellingPrice}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChange}
                  placeholder="Total numbers of Stock available"
                />
              </div>

              <div className="form-group">
                <label>Upload Product Images</label>
                <div className="upload-area">
                  <p>Enter Description</p>
                  <button type="button" className="btn-browse" onClick={handleBrowseClick}>Browse</button>
                </div>
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

              <button type="submit" className="btn-create">Create</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
