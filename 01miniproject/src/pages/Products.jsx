import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import { fetchCategories, setSelectedCategory } from '../redux/slices/categorySlice'
import { addToCart } from '../redux/slices/cartSlice'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react'

const Products = () => {
  const dispatch = useDispatch()
  
  // Read state from Redux store
  const { products, loading: productsLoading, error: productsError } = useSelector((state) => state.products)
  const { categories, selectedCategory, loading: categoriesLoading } = useSelector((state) => state.categories)
  
  // Local state for search & sorting
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('featured')

  // Fetch products and categories on component mount
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // 1. Category Filter
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false
      }
      
      // 2. Search Term Filter (Name, category or description)
      const term = searchTerm.toLowerCase().trim()
      if (term) {
        const matchesName = product.name?.toLowerCase().includes(term)
        const matchesCategory = product.category?.toLowerCase().includes(term)
        const matchesDesc = product.description?.toLowerCase().includes(term)
        return matchesName || matchesCategory || matchesDesc
      }
      
      return true
    })
    .sort((a, b) => {
      // 3. Sorting logic
      if (sortBy === 'low-to-high') {
        return a.price - b.price
      }
      if (sortBy === 'high-to-low') {
        return b.price - a.price
      }
      if (sortBy === 'a-z') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'z-a') {
        return b.name.localeCompare(a.name)
      }
      if (sortBy === 'featured') {
        const isAFeatured = a.featured || a.isFeatured ? 1 : 0
        const isBFeatured = b.featured || b.isFeatured ? 1 : 0
        return isBFeatured - isAFeatured
      }
      return 0
    })

  // Action helper to clear search and category filters
  const handleClearFilters = () => {
    setSearchTerm('')
    dispatch(setSelectedCategory('All'))
    setSortBy('featured')
  }

  // Handle Add to Cart action dispatch
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

  // Check loading and error states
  if (productsLoading || categoriesLoading) {
    return <LoadingSpinner message="Selecting our freshest blooms for you..." />
  }

  if (productsError) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger max-width-600 mx-auto py-4 shadow-sm" role="alert" style={{ maxWidth: '600px', borderRadius: '15px' }}>
          <h4 className="alert-heading fw-bold display-font">Connection Offline</h4>
          <p className="mb-0">{productsError}</p>
          <hr />
          <p className="mb-0 small text-muted">
            Please make sure the mock server is running via <code>npm run server</code> and try again.
          </p>
          <button onClick={() => dispatch(fetchProducts())} className="btn bloom-btn-primary mt-3">
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      {/* Page Header */}
      <div className="text-center mb-5">
        <span className="bloom-badge mb-2">Our Catalog</span>
        <h1 className="display-4 fw-bold display-font">Bloomora Boutique Shop</h1>
        <p className="text-bloom-muted mx-auto" style={{ maxWidth: '650px' }}>
          Choose from our luxury collection of hand-crafted arrangements. Freshness and romantic elegance are guaranteed in every bouquet.
        </p>
      </div>

      {/* Filter and Search Bar Section */}
      <div className="row g-3 align-items-center mb-5 p-4 rounded bloom-card">
        {/* Search Input */}
        <div className="col-12 col-md-5">
          <div className="position-relative">
            <span className="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
              <Search size={18} />
            </span>
            <input 
              type="text" 
              className="form-control bloom-input ps-5" 
              placeholder="Search by name, type, category..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Sorting Dropdown */}
        <div className="col-12 col-sm-6 col-md-3 ms-auto">
          <div className="d-flex align-items-center gap-2">
            <ArrowUpDown size={18} className="text-bloom-accent" style={{ color: 'var(--bloom-accent)' }} />
            <select 
              className="form-select bloom-input py-2" 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products selector"
            >
              <option value="featured">Featured First</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
              <option value="a-z">Alphabetical: A-Z</option>
              <option value="z-a">Alphabetical: Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Categories on Left, Products on Right */}
      <div className="row g-4">
        {/* Left Column: Categories List */}
        <div className="col-12 col-lg-3">
          <div className="p-4 rounded bloom-card mb-4">
            <h5 className="fw-bold mb-3 d-flex align-items-center gap-2 display-font">
              <SlidersHorizontal size={18} className="text-bloom-accent" style={{ color: 'var(--bloom-accent)' }} />
              <span>Filter Species</span>
            </h5>
            
            <div className="list-group list-group-flush gap-1">
              {/* "All" Category Option */}
              <button 
                onClick={() => dispatch(setSelectedCategory('All'))}
                className={`list-group-item list-group-item-action border-0 px-3 py-2 rounded fw-semibold text-start ${
                  selectedCategory === 'All' 
                    ? 'active bg-bloom-primary border-0 text-white' 
                    : 'text-bloom-muted bg-transparent'
                }`}
                style={{
                  backgroundColor: selectedCategory === 'All' ? 'var(--bloom-primary)' : 'transparent',
                  color: selectedCategory === 'All' ? '#FFF' : 'var(--bloom-text-secondary)',
                  transition: 'all 0.25s ease'
                }}
              >
                All Products
              </button>
              
              {/* Dynamic Categories list */}
              {categories.map((category) => (
                <button 
                  key={category.id}
                  onClick={() => dispatch(setSelectedCategory(category.name))}
                  className={`list-group-item list-group-item-action border-0 px-3 py-2 rounded fw-semibold text-start ${
                    selectedCategory === category.name 
                      ? 'active bg-bloom-primary border-0 text-white' 
                      : 'text-bloom-muted bg-transparent'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.name ? 'var(--bloom-primary)' : 'transparent',
                    color: selectedCategory === category.name ? '#FFF' : 'var(--bloom-text-secondary)',
                    transition: 'all 0.25s ease'
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Products Display */}
        <div className="col-12 col-lg-9">
          {filteredProducts.length === 0 ? (
            <EmptyState 
              title="No Flowers Match Your Filter"
              message="We couldn't find any arrangements matching your keyword or selected category. Try selecting another category or resetting filters."
              onActionClick={handleClearFilters}
              actionText="Reset All Filters"
            />
          ) : (
            <div className="row g-4">
              {filteredProducts.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-md-4 bloom-fade-in-up">
                  <ProductCard 
                    product={product} 
                    onAddToCart={handleAddToCart}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
