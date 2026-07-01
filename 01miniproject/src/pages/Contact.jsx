import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, AlertTriangle } from 'lucide-react'

const Contact = () => {
  // Input fields state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  // Input validation errors state
  const [errors, setErrors] = useState({})
  
  // Successful submit state toggle
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    // Clear error for this field as the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email Address is required.'
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required.'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message content is required.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      setIsSubmitted(true)
      // Reset form fields
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    }
  }

  const handleResetForm = () => {
    setIsSubmitted(false)
  }

  return (
    <div className="bloom-fade-in-up">
      {/* Page Header */}
      <div className="text-center mb-5">
        <span className="bloom-badge mb-2">Get In Touch</span>
        <h1 className="display-4 fw-bold display-font">Connect with Bloomora</h1>
        <p className="text-bloom-muted mx-auto" style={{ maxWidth: '650px' }}>
          Have questions about special events or custom arrangements? Reach out, and our concierge team will respond within 24 hours.
        </p>
      </div>

      <div className="row g-5">
        {/* Left Column: Contact info & Google Maps placeholder */}
        <div className="col-12 col-lg-5">
          {/* Info Card */}
          <div className="bloom-card p-4 mb-4">
            <h4 className="fw-bold mb-4 display-font">Boutique Information</h4>
            <ul className="list-unstyled mb-0 d-flex flex-column gap-4 text-bloom-muted">
              
              <li className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle flex-shrink-0" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Store Location</strong>
                  <span className="small">124 Lavender Avenue, Blossom District, CA 90210</span>
                </div>
              </li>

              <li className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle flex-shrink-0" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                  <Phone size={20} />
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Call Us</strong>
                  <span className="small">+1 (555) 234-5678</span>
                </div>
              </li>

              <li className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle flex-shrink-0" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                  <Mail size={20} />
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Email Us</strong>
                  <span className="small">hello@bloomora.com</span>
                </div>
              </li>

              <li className="d-flex align-items-start gap-3">
                <div className="p-2 rounded-circle flex-shrink-0" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                  <Clock size={20} />
                </div>
                <div>
                  <strong className="d-block" style={{ color: 'var(--bloom-text-primary)' }}>Business Hours</strong>
                  <span className="small d-block">Mon - Fri: 9:00 AM - 7:00 PM</span>
                  <span className="small d-block">Sat: 10:00 AM - 5:00 PM</span>
                  <span className="small d-block">Sun: Closed</span>
                </div>
              </li>

            </ul>
          </div>

          {/* Styled Google Maps Placeholder */}
          <div 
            className="bloom-card p-4 d-flex flex-column align-items-center justify-content-center border border-1 text-center" 
            style={{ 
              height: '250px',
              backgroundColor: 'rgba(234, 215, 192, 0.15)',
              borderColor: 'var(--bloom-secondary)'
            }}
          >
            <div className="p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
              <MapPin size={32} />
            </div>
            <strong className="d-block mb-1 display-font" style={{ color: 'var(--bloom-text-primary)' }}>Interactive Map Placeholder</strong>
            <span className="small text-bloom-muted px-4">
              Lavender Avenue corner, CA. Showing store location radius.
            </span>
          </div>
        </div>

        {/* Right Column: Contact form with validations */}
        <div className="col-12 col-lg-7">
          <div className="bloom-card p-4 p-md-5">
            {isSubmitted ? (
              // Success Alert Screen
              <div className="text-center py-4">
                <div className="d-inline-flex p-3 rounded-circle mb-4" style={{ backgroundColor: 'rgba(111, 158, 125, 0.15)', color: 'var(--bloom-success)' }}>
                  <CheckCircle size={48} style={{ color: 'var(--bloom-success)' }} />
                </div>
                <h3 className="fw-bold mb-3 display-font">Message Sent!</h3>
                <p className="text-bloom-muted mb-4" style={{ lineHeight: '1.6' }}>
                  Thank you for reaching out to us. We have received your query and a floral styling consultant will contact you shortly.
                </p>
                <button 
                  onClick={handleResetForm}
                  className="bloom-btn-primary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              // Form UI
              <form onSubmit={handleSubmit} noValidate>
                <h4 className="fw-bold mb-4 display-font">Send a Message</h4>

                {/* Name & Email Row */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="fullName" className="form-label small fw-semibold text-bloom-muted">Full Name *</label>
                    <input 
                      type="text" 
                      id="fullName"
                      name="fullName"
                      className={`form-control bloom-input ${errors.fullName ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. John Doe"
                      value={formData.fullName}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback d-block text-bloom-error mt-1 small">
                        {errors.fullName}
                      </div>
                    )}
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="email" className="form-label small fw-semibold text-bloom-muted">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      name="email"
                      className={`form-control bloom-input ${errors.email ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    {errors.email && (
                      <div className="invalid-feedback d-block text-bloom-error mt-1 small">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone & Subject Row */}
                <div className="row g-3 mb-3">
                  <div className="col-12 col-md-6">
                    <label htmlFor="phone" className="form-label small fw-semibold text-bloom-muted">Phone Number (Optional)</label>
                    <input 
                      type="tel" 
                      id="phone"
                      name="phone"
                      className="form-control bloom-input"
                      placeholder="e.g. +1 (555) 000-0000"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12 col-md-6">
                    <label htmlFor="subject" className="form-label small fw-semibold text-bloom-muted">Subject *</label>
                    <input 
                      type="text" 
                      id="subject"
                      name="subject"
                      className={`form-control bloom-input ${errors.subject ? 'is-invalid border-danger' : ''}`}
                      placeholder="e.g. Special Events Inquiry"
                      value={formData.subject}
                      onChange={handleChange}
                      aria-required="true"
                    />
                    {errors.subject && (
                      <div className="invalid-feedback d-block text-bloom-error mt-1 small">
                        {errors.subject}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message text area */}
                <div className="mb-4">
                  <label htmlFor="message" className="form-label small fw-semibold text-bloom-muted">Message Content *</label>
                  <textarea 
                    id="message"
                    name="message"
                    rows="5"
                    className={`form-control bloom-input ${errors.message ? 'is-invalid border-danger' : ''}`}
                    placeholder="Describe your floral request or question here..."
                    value={formData.message}
                    onChange={handleChange}
                    aria-required="true"
                  ></textarea>
                  {errors.message && (
                    <div className="invalid-feedback d-block text-bloom-error mt-1 small">
                      {errors.message}
                    </div>
                  )}
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  className="btn bloom-btn-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                >
                  <Send size={16} />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
