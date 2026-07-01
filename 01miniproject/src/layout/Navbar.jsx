import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ShoppingBag, Flower } from 'lucide-react'

const Navbar = () => {
  // Read totalQuantity from Redux store. Fallback to 0 if store is not populated yet
  const totalQuantity = useSelector((state) => state.cart?.totalQuantity || 0)

  return (
    <nav className="navbar navbar-expand-lg navbar-light bloom-sticky-nav py-3">
      <div className="container-xl">
        {/* Logo Section */}
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <Flower size={28} className="text-bloom-primary" style={{ color: 'var(--bloom-accent)' }} />
          <span 
            className="display-font fs-3 fw-bold" 
            style={{ 
              fontFamily: 'var(--bloom-font-primary)', 
              color: 'var(--bloom-text-primary)',
              letterSpacing: '1px'
            }}
          >
            Bloomora
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button 
          className="navbar-toggler border-0 shadow-none" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#bloomoraNavbar" 
          aria-controls="bloomoraNavbar" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Links */}
        <div className="collapse navbar-collapse" id="bloomoraNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-4 text-center">
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link fw-semibold px-2 ${isActive ? 'text-bloom-accent border-bottom border-2 border-bloom-primary' : 'text-bloom-text-secondary'}`
                } 
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link fw-semibold px-2 ${isActive ? 'text-bloom-accent border-bottom border-2 border-bloom-primary' : 'text-bloom-text-secondary'}`
                } 
                to="/products"
              >
                Shop
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link fw-semibold px-2 ${isActive ? 'text-bloom-accent border-bottom border-2 border-bloom-primary' : 'text-bloom-text-secondary'}`
                } 
                to="/about"
              >
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink 
                className={({ isActive }) => 
                  `nav-link fw-semibold px-2 ${isActive ? 'text-bloom-accent border-bottom border-2 border-bloom-primary' : 'text-bloom-text-secondary'}`
                } 
                to="/contact"
              >
                Contact
              </NavLink>
            </li>
          </ul>

          {/* Cart Icon trigger */}
          <div className="d-flex justify-content-center mt-3 mt-lg-0">
            <Link 
              className="btn btn-link position-relative text-decoration-none d-flex align-items-center justify-content-center p-2 rounded-circle" 
              to="/cart"
              style={{ 
                color: 'var(--bloom-text-primary)',
                transition: 'background-color 0.3s ease',
                backgroundColor: 'rgba(216, 167, 177, 0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(216, 167, 177, 0.25)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(216, 167, 177, 0.1)'}
            >
              <ShoppingBag size={22} style={{ color: 'var(--bloom-accent)' }} />
              {totalQuantity > 0 && (
                <span 
                  className="position-absolute top-0 start-100 translate-middle badge rounded-circle"
                  style={{
                    backgroundColor: 'var(--bloom-accent)',
                    color: '#FFF',
                    fontSize: '0.7rem',
                    padding: '4px 7px'
                  }}
                >
                  {totalQuantity}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
