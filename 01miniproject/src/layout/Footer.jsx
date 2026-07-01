import React from 'react'
import { Link } from 'react-router-dom'
import { Flower, Phone, Mail, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bloom-footer py-5 mt-auto">
      <div className="container-xl">
        <div className="row g-4 justify-content-between">
          
          {/* Brand Bio */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <Flower size={24} style={{ color: 'var(--bloom-accent)' }} />
              <span className="display-font fs-4 fw-bold" style={{ fontFamily: 'var(--bloom-font-primary)', color: 'var(--bloom-text-primary)' }}>
                Bloomora
              </span>
            </div>
            <p className="text-muted small mb-4" style={{ lineHeight: '1.6' }}>
              Experience the art of gifting. We curate premium floral designs and fresh blooms to create romantic, warm, and memorable connections for your special moments.
            </p>
            <div className="d-flex gap-3">
              {/* Instagram Icon */}
              <a href="#" className="text-decoration-none" style={{ color: 'var(--bloom-text-secondary)' }} aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              {/* Facebook Icon */}
              <a href="#" className="text-decoration-none" style={{ color: 'var(--bloom-text-secondary)' }} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              {/* Twitter Icon */}
              <a href="#" className="text-decoration-none" style={{ color: 'var(--bloom-text-secondary)' }} aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bloom-text-primary)' }}>Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-decoration-none text-muted">Home</Link>
              </li>
              <li>
                <Link to="/products" className="text-decoration-none text-muted">Shop</Link>
              </li>
              <li>
                <Link to="/about" className="text-decoration-none text-muted">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="text-decoration-none text-muted">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="col-6 col-md-2">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bloom-text-primary)' }}>Customer Care</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <a href="#" className="text-decoration-none text-muted">Shipping Policy</a>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-muted">Returns & Refunds</a>
              </li>
              <li>
                <Link to="/faq" className="text-decoration-none text-muted">FAQ</Link>
              </li>
              <li>
                <a href="#" className="text-decoration-none text-muted">Privacy Policy</a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-12 col-md-3">
            <h6 className="fw-bold mb-3" style={{ color: 'var(--bloom-text-primary)' }}>Boutique Shop</h6>
            <ul className="list-unstyled d-flex flex-column gap-3 small text-muted">
              <li className="d-flex align-items-start gap-2">
                <MapPin size={18} className="text-bloom-accent flex-shrink-0 mt-1" style={{ color: 'var(--bloom-accent)' }} />
                <span>124 Lavender Avenue, Blossom District, CA 90210</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Phone size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Mail size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                <span>hello@bloomora.com</span>
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-4" style={{ borderColor: 'var(--bloom-secondary)' }} />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="text-muted small mb-0">&copy; {new Date().getFullYear()} Bloomora. All rights reserved.</p>
          <p className="text-muted small mb-0">Designed with romance and elegance.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
