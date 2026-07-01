import React from 'react'
import { Sparkles, Heart, Award, ShieldCheck } from 'lucide-react'

const About = () => {
  return (
    <div className="bloom-fade-in-up">
      {/* Page Header */}
      <div className="text-center mb-5">
        <span className="bloom-badge mb-2">Our Philosophy</span>
        <h1 className="display-4 fw-bold display-font">About Bloomora</h1>
        <p className="text-bloom-muted mx-auto" style={{ maxWidth: '650px' }}>
          Learn about our romantic history, customer dedication, and handcrafted floral styling guidelines.
        </p>
      </div>

      {/* 1. Our Story Section */}
      <section className="row align-items-center g-5 mb-5 py-3">
        <div className="col-12 col-md-6">
          <h2 className="display-5 fw-bold mb-4 display-font">Our Romantic Story</h2>
          <p className="text-bloom-muted mb-3" style={{ lineHeight: '1.7' }}>
            Founded in 2026, Bloomora started as a small Lavender Avenue shop with a simple, passionate mission: to elevate flower buying into a premium romantic experience. We wanted to move away from assembly-line floristry and return to bespoke, artisan curation.
          </p>
          <p className="text-bloom-muted mb-3" style={{ lineHeight: '1.7' }}>
            Today, our team of dedicated visual styling artists sources local organic stems directly from sustainable family-run eco-growers. We combine traditional arrangement structures with modern minimalist designs, creating romantic, natural, and memorable visual statements.
          </p>
          <p className="text-bloom-muted mb-0" style={{ lineHeight: '1.7' }}>
            Whether celebrating milestones, expressing deep romantic thoughts, or styling a cozy indoor sanctuary, Bloomora serves as your trusted partner in delivering elegant emotions.
          </p>
        </div>
        <div className="col-12 col-md-6">
          <div className="bloom-img-container" style={{ height: '400px', boxShadow: 'var(--bloom-shadow-hover)' }}>
            <img src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800" alt="Boutique florist trimming fresh flower stems" />
          </div>
        </div>
      </section>

      {/* 2. Mission & Vision Section */}
      <section className="row g-4 mb-5 pb-3">
        <div className="col-12 col-md-6">
          <div className="p-5 rounded-4 h-100 bloom-card" style={{ backgroundColor: 'rgba(243, 217, 210, 0.25)', border: '1px solid var(--bloom-secondary)' }}>
            <h3 className="fw-bold mb-3 display-font d-flex align-items-center gap-2">
              <Sparkles className="text-bloom-accent" style={{ color: 'var(--bloom-accent)' }} />
              <span>Our Mission</span>
            </h3>
            <p className="text-bloom-muted mb-0" style={{ lineHeight: '1.7' }}>
              To design and deliver handcrafted premium floral arrangements that create strong, warm emotional connections. We strive to maintain absolute organic quality, artistic integrity, and customer-first values in every single delivery.
            </p>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="p-5 rounded-4 h-100 bloom-card" style={{ backgroundColor: 'rgba(243, 217, 210, 0.25)', border: '1px solid var(--bloom-secondary)' }}>
            <h3 className="fw-bold mb-3 display-font d-flex align-items-center gap-2">
              <Heart className="text-bloom-accent" style={{ color: 'var(--bloom-accent)' }} />
              <span>Our Vision</span>
            </h3>
            <p className="text-bloom-muted mb-0" style={{ lineHeight: '1.7' }}>
              To become the leading modern luxury e-commerce florist, recognized globally for setting premium standards in floral design, absolute freshness guarantees, eco-friendly sourcing, and responsive customer-care philosophies.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="mb-5 py-4">
        <div className="text-center mb-5">
          <span className="bloom-badge mb-2">Standards</span>
          <h2 className="display-5 fw-bold mb-3 display-font">Our Core Values</h2>
          <p className="text-bloom-muted mx-auto" style={{ maxWidth: '600px' }}>
            We hold ourselves to rigorous quality and creative guidelines to deliver an exceptional boutique experience.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-4">
            <div className="bloom-card p-4 text-center h-100">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                <Award size={24} />
              </div>
              <h5 className="fw-bold mb-2 display-font">Artisan Design</h5>
              <p className="text-bloom-muted small mb-0" style={{ lineHeight: '1.6' }}>
                We reject standard pre-packaged bouquets. Every selection is an original concept designed by master floral architects.
              </p>
            </div>
          </div>
          
          <div className="col-12 col-md-4">
            <div className="bloom-card p-4 text-center h-100">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                <ShieldCheck size={24} />
              </div>
              <h5 className="fw-bold mb-2 display-font">Eco-Fresh Sourcing</h5>
              <p className="text-bloom-muted small mb-0" style={{ lineHeight: '1.6' }}>
                We cut carbon miles and guarantee freshness by sourcing directly from organic farms that practice crop-rotation.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4">
            <div className="bloom-card p-4 text-center h-100">
              <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
                <Heart size={24} />
              </div>
              <h5 className="fw-bold mb-2 display-font">Empathetic Care</h5>
              <p className="text-bloom-muted small mb-0" style={{ lineHeight: '1.6' }}>
                We support our customers at every step. From purchase delivery tracking to custom cards, we are here with soft, friendly care.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Satisfaction Philosophy */}
      <section className="p-5 rounded-4 bloom-card text-center mb-4" style={{ backgroundColor: 'rgba(234, 215, 192, 0.15)', border: '1px solid var(--bloom-beige)' }}>
        <span className="bloom-badge mb-2">Our Promise</span>
        <h3 className="display-6 fw-bold mb-3 display-font">Customer Satisfaction Philosophy</h3>
        <p className="text-bloom-muted mx-auto mb-0" style={{ maxWidth: '750px', lineHeight: '1.8' }}>
          At Bloomora, your happiness is our ultimate success metric. If a delivery does not meet your expectations or does not arrive fresh, our support team will replace your arrangement or issue a full refund immediately—no complicated conditions, no hurdles. We believe in building lifelong bonds of trust.
        </p>
      </section>
    </div>
  )
}

export default About
