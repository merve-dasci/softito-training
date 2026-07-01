import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  increaseQuantity, 
  decreaseQuantity, 
  removeFromCart, 
  clearCart 
} from '../redux/slices/cartSlice'
import EmptyState from '../components/EmptyState'
import { Minus, Plus, Trash2, ArrowLeft, CreditCard, ShoppingBag, CheckCircle, RefreshCw } from 'lucide-react'

const Cart = () => {
  const dispatch = useDispatch()
  const { cartItems, totalPrice, totalQuantity } = useSelector((state) => state.cart)
  
  // Checkout success view toggle and order id state
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handleCheckout = () => {
    // Generate a random mock order receipt ID
    const randomId = 'BLOOM-' + Math.floor(100000 + Math.random() * 900000)
    setOrderId(randomId)
    setCheckoutSuccess(true)
    
    // Clear Redux cart state
    dispatch(clearCart())
  }

  // Handle shopping return state resetting
  const handleResetCheckout = () => {
    setCheckoutSuccess(false)
    setOrderId('')
  }

  // If order was placed successfully
  if (checkoutSuccess) {
    return (
      <div className="container py-5 text-center bloom-fade-in-up">
        <div className="p-5 rounded-4 bloom-card max-width-600 mx-auto text-center" style={{ maxWidth: '600px' }}>
          <div className="d-inline-flex p-3 rounded-circle mb-4" style={{ backgroundColor: 'rgba(111, 158, 125, 0.15)', color: 'var(--bloom-success)' }}>
            <CheckCircle size={52} style={{ color: 'var(--bloom-success)' }} />
          </div>
          <h1 className="fw-bold display-font mb-3">Order Confirmed!</h1>
          <p className="fs-5 text-bloom-muted mb-4" style={{ lineHeight: '1.6' }}>
            Thank you for shopping with Bloomora. Your floral gifts are being hand-curated by our artisan florists and will be delivered shortly.
          </p>
          <div className="bg-light p-3 rounded-3 mb-4 d-inline-block px-4">
            <span className="small text-muted d-block text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>Order ID Receipt</span>
            <strong className="fs-5 text-bloom-accent font-monospace" style={{ color: 'var(--bloom-accent)' }}>{orderId}</strong>
          </div>
          <div>
            <Link 
              to="/products" 
              onClick={handleResetCheckout}
              className="bloom-btn-primary text-decoration-none d-inline-flex align-items-center gap-2"
            >
              <ShoppingBag size={18} />
              <span>Continue Shopping</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Empty state check
  if (cartItems.length === 0) {
    return (
      <div className="container py-4 bloom-fade-in-up">
        <EmptyState 
          title="Your Shopping Cart is Empty"
          message="It looks like you haven't added any fresh floral arrangements to your cart yet. Explore our boutique catalog to find the perfect gift."
          onActionClick={() => {}}
          actionText=""
        />
        <div className="text-center mt-2">
          <Link to="/products" className="bloom-btn-primary text-decoration-none d-inline-flex align-items-center gap-2">
            <ShoppingBag size={18} />
            <span>Browse Flower Catalog</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4 bloom-fade-in-up">
      {/* Title */}
      <div className="mb-5">
        <span className="bloom-badge mb-2">Cart Details</span>
        <h1 className="display-4 fw-bold display-font">Your Floral Selections</h1>
        <p className="text-bloom-muted">Review items, quantities, and totals before proceeding to payment.</p>
      </div>

      <div className="row g-5">
        {/* Left Column: Cart Items List */}
        <div className="col-12 col-lg-8">
          <div className="bloom-card p-4 mb-4">
            <div className="table-responsive">
              <table className="table table-borderless align-middle mb-0">
                <thead>
                  <tr className="border-bottom" style={{ borderColor: 'var(--bloom-secondary)' }}>
                    <th scope="col" className="text-muted pb-3" style={{ fontSize: '0.85rem' }}>Product</th>
                    <th scope="col" className="text-muted pb-3 text-center" style={{ fontSize: '0.85rem' }}>Price</th>
                    <th scope="col" className="text-muted pb-3 text-center" style={{ fontSize: '0.85rem' }}>Quantity</th>
                    <th scope="col" className="text-muted pb-3 text-end" style={{ fontSize: '0.85rem' }}>Total</th>
                    <th scope="col" className="text-muted pb-3 text-center" style={{ fontSize: '0.85rem' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id} className="border-bottom" style={{ borderColor: 'rgba(243, 217, 210, 0.4)' }}>
                      {/* Image + Title */}
                      <td className="py-3">
                        <Link to={`/products/${item.id}`} className="text-decoration-none d-flex align-items-center gap-3">
                          <div 
                            className="bloom-img-container flex-shrink-0" 
                            style={{ width: '70px', height: '80px', borderRadius: '12px' }}
                          >
                            <img src={item.image} alt={item.name} />
                          </div>
                          <div>
                            <strong className="text-bloom-text-primary display-font d-block" style={{ fontSize: '1.05rem', color: 'var(--bloom-text-primary)' }}>
                              {item.name}
                            </strong>
                            <span className="small text-muted text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>
                              {item.category}
                            </span>
                          </div>
                        </Link>
                      </td>
                      
                      {/* Price */}
                      <td className="py-3 text-center fw-semibold">
                        ₺{item.price}
                      </td>

                      {/* Quantity Controls */}
                      <td className="py-3 text-center">
                        <div 
                          className="d-inline-flex align-items-center bg-light border rounded-pill p-1 mx-auto" 
                          style={{ borderColor: 'var(--bloom-secondary)' }}
                        >
                          <button 
                            onClick={() => dispatch(decreaseQuantity(item.id))}
                            className="btn btn-link text-decoration-none p-1 text-bloom-accent border-0"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 fw-bold font-monospace" style={{ minWidth: '25px', textAlign: 'center', fontSize: '0.9rem' }}>
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => dispatch(increaseQuantity(item.id))}
                            className="btn btn-link text-decoration-none p-1 text-bloom-accent border-0"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-3 text-end fw-bold text-bloom-accent">
                        ₺{item.totalPrice}
                      </td>

                      {/* Remove Button */}
                      <td className="py-3 text-center">
                        <button 
                          onClick={() => dispatch(removeFromCart(item.id))}
                          className="btn btn-link p-2 text-bloom-error text-decoration-none border-0"
                          style={{ color: 'var(--bloom-error)' }}
                          aria-label="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cart actions */}
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <Link to="/products" className="btn text-bloom-accent d-inline-flex align-items-center gap-2 fw-semibold px-0 text-decoration-none">
              <ArrowLeft size={16} />
              <span>Continue Shopping</span>
            </Link>
            <button 
              onClick={() => dispatch(clearCart())}
              className="btn btn-link text-bloom-error text-decoration-none d-inline-flex align-items-center gap-1 fw-semibold p-0"
              style={{ color: 'var(--bloom-error)' }}
            >
              <RefreshCw size={15} />
              <span>Clear Entire Cart</span>
            </button>
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="col-12 col-lg-4">
          <div className="card bloom-card p-4" style={{ backgroundColor: 'rgba(243, 217, 210, 0.15)', border: '1px solid var(--bloom-secondary)' }}>
            <h4 className="fw-bold mb-4 display-font">Order Summary</h4>
            
            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--bloom-secondary)' }}>
              <span className="text-muted">Total Quantity</span>
              <strong className="fw-semibold">{totalQuantity} arrangements</strong>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--bloom-secondary)' }}>
              <span className="text-muted">Subtotal</span>
              <strong className="fw-semibold">₺{totalPrice}</strong>
            </div>

            <div className="d-flex justify-content-between mb-3 pb-3 border-bottom" style={{ borderColor: 'var(--bloom-secondary)' }}>
              <span className="text-muted">Boutique Delivery</span>
              <span className="text-success fw-semibold" style={{ color: 'var(--bloom-success)' }}>FREE</span>
            </div>

            <div className="d-flex justify-content-between mb-4 mt-2">
              <span className="fw-bold fs-5">Estimated Total</span>
              <span className="fw-bold fs-4 text-bloom-accent">₺{totalPrice}</span>
            </div>

            {/* Checkout Button */}
            <button 
              onClick={handleCheckout}
              className="btn bloom-btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
            >
              <CreditCard size={18} />
              <span>Proceed to Checkout</span>
            </button>

            {/* Guarantee Tag */}
            <p className="small text-bloom-muted text-center mt-3 mb-0" style={{ fontSize: '0.75rem' }}>
              Hand delivered fresh under Bloomora Boutique standards.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
