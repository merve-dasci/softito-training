import React from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, AlertCircle } from 'lucide-react'

const ProductCard = ({ product, onAddToCart }) => {
  const isOutOfStock = product.stock <= 0
  const isLowStock = product.stock > 0 && product.stock <= 5

  return (
    <div className="card h-100 bloom-card">
      {/* Image Wrap */}
      <div className="bloom-img-container" style={{ height: '280px' }}>
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600'} 
          alt={product.name} 
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&q=80&w=600'
          }}
        />
        {/* Featured Tag */}
        {(product.featured || product.isFeatured) && (
          <span 
            className="position-absolute badge"
            style={{
              backgroundColor: 'var(--bloom-accent)',
              color: '#FFF',
              borderRadius: '30px',
              padding: '6px 12px',
              fontSize: '0.75rem',
              top: '15px',
              left: '15px'
            }}
          >
            Featured
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="card-body p-4 d-flex flex-column justify-content-between">
        <div>
          {/* Category Badge */}
          <span className="text-bloom-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '1px' }}>
            {product.category}
          </span>
          {/* Title */}
          <h5 className="card-title fw-bold mt-1 mb-2 display-font" style={{ fontSize: '1.15rem' }}>
            {product.name}
          </h5>
          
          {/* Stock Indicator */}
          <div className="my-2">
            {isOutOfStock ? (
              <span className="small text-bloom-error d-flex align-items-center gap-1">
                <AlertCircle size={14} />
                <span>Out of Stock</span>
              </span>
            ) : isLowStock ? (
              <span className="small text-bloom-warning d-flex align-items-center gap-1" style={{ color: 'var(--bloom-warning)' }}>
                <AlertCircle size={14} />
                <span>Only {product.stock} left in stock!</span>
              </span>
            ) : (
              <span className="small text-bloom-success d-flex align-items-center gap-1" style={{ color: 'var(--bloom-success)' }}>
                <span>In Stock ({product.stock})</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-3">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fs-5 fw-bold text-bloom-accent">
              ₺{product.price}
            </span>
          </div>

          <div className="row g-2">
            <div className="col-8">
              <button 
                onClick={() => onAddToCart && onAddToCart(product)}
                disabled={isOutOfStock}
                className="btn w-100 bloom-btn-primary py-2 d-flex align-items-center justify-content-center gap-1"
                style={{ fontSize: '0.85rem' }}
              >
                <ShoppingCart size={15} />
                <span>Add to Cart</span>
              </button>
            </div>
            <div className="col-4">
              <Link 
                to={`/products/${product.id}`} 
                className="btn w-100 bloom-btn-secondary py-2 px-1 d-flex align-items-center justify-content-center"
                style={{ fontSize: '0.85rem' }}
              >
                <Eye size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
