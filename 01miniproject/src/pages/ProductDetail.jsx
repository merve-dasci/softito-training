import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductById, fetchProducts } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { Minus, Plus, ShoppingCart, Truck, Award, Heart, ArrowLeft, AlertCircle } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)

  // Read state from Redux store
  const { selectedProduct, products, loading, error } = useSelector((state) => state.products)

  // Fetch product detail and whole catalog (for related products) on mount or ID update
  useEffect(() => {
    dispatch(fetchProductById(id))
    dispatch(fetchProducts())
    setQuantity(1) // Reset quantity on page navigation
  }, [dispatch, id])

  // Related products logic: items of same category, excluding current product, limit to 3
  const relatedProducts = products
    .filter(
      (item) => 
        item.category === selectedProduct?.category && 
        item.id !== selectedProduct?.id
    )
    .slice(0, 3)

  const handleDecreaseQty = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const handleIncreaseQty = () => {
    if (selectedProduct && quantity < selectedProduct.stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    if (selectedProduct) {
      dispatch(
        addToCart({
          ...selectedProduct,
          quantity: quantity
        })
      )
    }
  }

  if (loading) {
    return <LoadingSpinner message="Opening boutique display vault..." />
  }

  if (error) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger max-width-600 mx-auto py-4 shadow-sm" role="alert" style={{ maxWidth: '600px', borderRadius: '15px' }}>
          <h4 className="alert-heading fw-bold display-font">Error Loading Product</h4>
          <p className="mb-0">{error}</p>
          <hr />
          <Link to="/products" className="btn bloom-btn-primary mt-3">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  if (!selectedProduct) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-warning max-width-600 mx-auto py-4 shadow-sm" role="alert" style={{ maxWidth: '600px', borderRadius: '15px' }}>
          <h4 className="alert-heading fw-bold display-font">Product Not Found</h4>
          <p className="mb-0">The requested floral arrangement could not be located in our records.</p>
          <hr />
          <Link to="/products" className="btn bloom-btn-primary mt-3">
            Back to Shop
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = selectedProduct.stock <= 0
  const isLowStock = selectedProduct.stock > 0 && selectedProduct.stock <= 5

  return (
    <div className="bloom-fade-in-up">
      {/* Back button & Breadcrumbs */}
      <div className="mb-4">
        <Link to="/products" className="text-decoration-none d-inline-flex align-items-center gap-2 text-bloom-accent fw-semibold">
          <ArrowLeft size={16} />
          <span>Back to Shop</span>
        </Link>
      </div>

      {/* Main Detail Section */}
      <section className="row g-5 mb-5 align-items-center">
        {/* Left Column: Product Image */}
        <div className="col-12 col-lg-6">
          <div 
            className="bloom-img-container" 
            style={{ 
              height: '520px', 
              boxShadow: 'var(--bloom-shadow-hover)',
              borderRadius: '24px'
            }}
          >
            <img 
              src={selectedProduct.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800'} 
              alt={selectedProduct.name} 
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=800'
              }}
            />
          </div>
        </div>

        {/* Right Column: Specifications and Actions */}
        <div className="col-12 col-lg-6">
          <div>
            <span className="bloom-badge mb-2">{selectedProduct.category}</span>
            <h1 className="display-4 fw-bold display-font mb-2">{selectedProduct.name}</h1>
            
            {/* Pricing */}
            <div className="mb-3">
              <span className="fs-3 fw-bold text-bloom-accent">₺{selectedProduct.price}</span>
            </div>

            {/* Stock status indicator badge */}
            <div className="mb-4">
              {isOutOfStock ? (
                <span className="badge bg-danger px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                  <AlertCircle size={14} />
                  <span>Out of Stock</span>
                </span>
              ) : isLowStock ? (
                <span className="badge bg-warning text-dark px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                  <AlertCircle size={14} />
                  <span>Only {selectedProduct.stock} left in stock!</span>
                </span>
              ) : (
                <span className="badge bg-success px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1">
                  <span>In Stock ({selectedProduct.stock})</span>
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-bloom-muted fs-5 mb-4" style={{ lineHeight: '1.7' }}>
              {selectedProduct.description || 'Experience the luxurious details of this premium floral arrangement. Perfect for conveying romantic feelings or styling your home sanctuary.'}
            </p>

            {/* Delivery/Quality Information Box */}
            <div className="p-4 rounded-4 mb-4 border border-1" style={{ backgroundColor: 'rgba(243, 217, 210, 0.25)', borderColor: 'var(--bloom-secondary)' }}>
              <ul className="list-unstyled mb-0 d-flex flex-column gap-3">
                <li className="d-flex align-items-start gap-3">
                  <Truck size={20} className="text-bloom-accent flex-shrink-0 mt-1" style={{ color: 'var(--bloom-accent)' }} />
                  <div>
                    <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Same-Day Delivery Available</strong>
                    <span className="small text-bloom-muted">Order before 2 PM for CA hand delivery.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <Award size={20} className="text-bloom-accent flex-shrink-0 mt-1" style={{ color: 'var(--bloom-accent)' }} />
                  <div>
                    <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>7-Day Freshness Guarantee</strong>
                    <span className="small text-bloom-muted">Sourced directly from premium eco-growers.</span>
                  </div>
                </li>
                <li className="d-flex align-items-start gap-3">
                  <Heart size={20} className="text-bloom-accent flex-shrink-0 mt-1" style={{ color: 'var(--bloom-accent)' }} />
                  <div>
                    <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Premium Packaging Included</strong>
                    <span className="small text-bloom-muted">Delivered in luxury boxes with a personalized note.</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quantity Controller & Add Actions */}
            {!isOutOfStock && (
              <div className="d-flex flex-wrap align-items-center gap-4 mt-4">
                {/* Quantity Controls */}
                <div>
                  <label className="small text-bloom-muted d-block mb-2 fw-semibold">Quantity</label>
                  <div className="d-flex align-items-center bg-white border rounded-pill p-1" style={{ borderColor: 'var(--bloom-secondary)' }}>
                    <button 
                      onClick={handleDecreaseQty}
                      disabled={quantity <= 1}
                      className="btn btn-link text-decoration-none p-2 text-bloom-accent border-0"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-3 fw-bold font-monospace" style={{ minWidth: '35px', textAlign: 'center' }}>
                      {quantity}
                    </span>
                    <button 
                      onClick={handleIncreaseQty}
                      disabled={quantity >= selectedProduct.stock}
                      className="btn btn-link text-decoration-none p-2 text-bloom-accent border-0"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Add button */}
                <div className="flex-grow-1 align-self-end">
                  <button 
                    onClick={handleAddToCart}
                    className="btn bloom-btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <ShoppingCart size={18} />
                    <span>Add {quantity} to Cart</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="mt-5 pt-4">
        <h3 className="display-font fw-bold mb-4">You May Also Like</h3>
        {relatedProducts.length === 0 ? (
          <p className="text-bloom-muted">Explore our collections page to browse other beautiful arrangements in the shop!</p>
        ) : (
          <div className="row g-4">
            {relatedProducts.map((product) => (
              <div key={product.id} className="col-12 col-md-4 bloom-fade-in-up">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  )
}

export default ProductDetail
