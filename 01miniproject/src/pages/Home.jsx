import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../redux/slices/productSlice'
import { fetchCategories, setSelectedCategory } from '../redux/slices/categorySlice'
import { addToCart } from '../redux/slices/cartSlice'
import ProductCard from '../components/ProductCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { ArrowRight, Sparkles, Heart, Gift, Flower } from 'lucide-react'

// Layout image assets
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&q=80&w=800',
  about: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600'
}

// Icon helper function based on category name
const getCategoryIcon = (name) => {
  const normalized = name.toLowerCase()
  if (normalized.includes('rose')) return <Heart size={22} />
  if (normalized.includes('birthday')) return <Gift size={22} />
  if (normalized.includes('anniversary') || normalized.includes('wedding')) return <Heart size={22} />
  return <Sparkles size={22} />
}

// Short tagline helper based on category name
const getCategoryTagline = (name) => {
  const normalized = name.toLowerCase()
  if (normalized.includes('rose')) return 'Classic Romance'
  if (normalized.includes('tulip')) return 'Spring Freshness'
  if (normalized.includes('orchid')) return 'Luxurious Elegance'
  if (normalized.includes('lily') || normalized.includes('lilies')) return 'Pure Sophistication'
  if (normalized.includes('birthday')) return 'Joyful Celebrations'
  if (normalized.includes('anniversary')) return 'Timeless Bonds'
  if (normalized.includes('wedding')) return 'Dreamy Weddings'
  if (normalized.includes('plant')) return 'Green Sanctuary'
  return 'Boutique Collection'
}

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Read data from Redux
  const { products, loading: productsLoading } = useSelector((state) => state.products)
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories)

  // Fetch collections on mount
  useEffect(() => {
    dispatch(fetchProducts())
    dispatch(fetchCategories())
  }, [dispatch])

  // Filter featured products (limit to 4)
  const featuredProducts = products
    .filter((p) => p.featured === true || p.isFeatured === true)
    .slice(0, 4)

  // Handle category card click
  const handleCategorySelect = (categoryName) => {
    dispatch(setSelectedCategory(categoryName))
    navigate('/products')
  }

  // Handle Add to Cart trigger
  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }))
  }

  return (
    <div className="bloom-fade-in-up">
      
      {/* 1. HERO SECTION */}
      <section className="row align-items-center mb-5 pb-5 g-5" style={{ minHeight: '60vh' }}>
        <div className="col-12 col-lg-6">
          <div className="d-flex align-items-center gap-2 mb-3">
            <span className="bloom-badge">Boutique Florist</span>
            <span className="text-muted small">Est. 2026</span>
          </div>
          <h1 className="display-3 fw-bold mb-3 display-font" style={{ lineHeight: '1.15' }}>
            Fresh Flowers For Your <br />
            <span className="text-bloom-accent" style={{ fontStyle: 'italic', fontWeight: 'normal' }}>Special Moments</span>
          </h1>
          <p className="text-bloom-muted fs-5 mb-4" style={{ maxWidth: '520px', lineHeight: '1.6' }}>
            Experience the luxury of hand-curated floral designs, crafted with love and delivered fresh to your doorstep. We turn blossoms into warm romantic expressions.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <Link to="/products" className="bloom-btn-primary text-decoration-none d-inline-flex align-items-center gap-2">
              <span>Shop Now</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#featured-products" className="bloom-btn-secondary text-decoration-none d-inline-flex align-items-center">
              Explore Collection
            </a>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="bloom-img-container bloom-float" style={{ height: '480px', boxShadow: '0 20px 50px rgba(183, 110, 121, 0.15)' }}>
            <img src={IMAGES.hero} alt="Luxury bouquet setup in boutique shop" />
          </div>
        </div>
      </section>

      {/* 2. FEATURED PRODUCTS SECTION */}
      <section id="featured-products" className="mb-5 pb-5" style={{ scrollMarginTop: '100px' }}>
        <div className="text-center mb-5">
          <span className="bloom-badge mb-2">Our Curation</span>
          <h2 className="display-5 fw-bold mb-3 display-font">Selected Masterpieces</h2>
          <p className="text-bloom-muted mx-auto" style={{ maxWidth: '600px' }}>
            Explore our most loved floral arrangements, curated daily by our artisan florists with the finest blossoms of the season.
          </p>
        </div>

        {productsLoading ? (
          <LoadingSpinner message="Selecting our masterpieces..." />
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <Flower className="mb-2" size={32} />
            <p>No featured products available at the moment. Explore our shop to see all collections!</p>
          </div>
        ) : (
          <div className="row g-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="col-12 col-sm-6 col-lg-3">
                <ProductCard 
                  product={product} 
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. CATEGORIES SECTION */}
      <section className="mb-5 pb-5">
        <div className="text-center mb-5">
          <span className="bloom-badge mb-2">Categories</span>
          <h2 className="display-5 fw-bold mb-3 display-font">Shop by Arrangement</h2>
          <p className="text-bloom-muted mx-auto" style={{ maxWidth: '600px' }}>
            Find the perfect match for your sentiment. Filter by flower species or curated collection styles.
          </p>
        </div>

        {categoriesLoading ? (
          <LoadingSpinner message="Loading arrangement tags..." />
        ) : (
          <div className="row g-4">
            {categories.map((category) => (
              <div key={category.id} className="col-6 col-md-3">
                <button 
                  onClick={() => handleCategorySelect(category.name)} 
                  className="w-100 btn p-0 text-decoration-none border-0 bg-transparent text-start"
                  aria-label={`Select category ${category.name}`}
                >
                  <div className="bloom-category-card">
                    <div className="icon-wrap">
                      {getCategoryIcon(category.name)}
                    </div>
                    <h5 className="fw-bold mb-1 display-font" style={{ fontSize: '1.1rem', color: 'var(--bloom-text-primary)' }}>
                      {category.name}
                    </h5>
                    <p className="text-muted small mb-0">
                      {getCategoryTagline(category.name)}
                    </p>
                  </div>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. PROMOTIONAL CAMPAIGN BANNER */}
      <section className="mb-5 pb-5">
        <div className="bloom-campaign-banner text-center text-md-start py-5 px-4 px-md-5">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md-8">
              <span className="badge bg-white text-bloom-accent px-3 py-2 rounded-pill fw-bold mb-3" style={{ fontSize: '0.8rem' }}>
                Limited Time Campaign
              </span>
              <h3 className="display-5 fw-bold mb-2 display-font text-bloom-text-primary">
                Spring Romance Collection
              </h3>
              <p className="text-bloom-muted mb-0 fs-5" style={{ maxWidth: '600px' }}>
                Enjoy a luxurious <strong className="text-bloom-accent">20% discount</strong> on all fresh tulip bouquets and wedding collections.
              </p>
            </div>
            <div className="col-12 col-md-4 text-md-end">
              <div className="d-inline-block bg-white px-4 py-3 rounded shadow-sm text-center mb-3 mb-md-0" style={{ border: '2px dashed var(--bloom-accent)' }}>
                <span className="small text-muted d-block text-uppercase fw-semibold" style={{ letterSpacing: '1px' }}>Coupon Code</span>
                <span className="fs-4 fw-bold text-bloom-accent font-monospace">SPRING20</span>
              </div>
              <div className="mt-3">
                <Link to="/products" className="bloom-btn-primary text-decoration-none d-inline-flex align-items-center gap-2">
                  <span>Claim Offer</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ABOUT PREVIEW SECTION */}
      <section className="mb-5 pb-4">
        <div className="row align-items-center g-5">
          <div className="col-12 col-md-6 order-2 order-md-1">
            <div className="bloom-img-container" style={{ height: '400px', boxShadow: 'var(--bloom-shadow)' }}>
              <img src={IMAGES.about} alt="Artisan florist at work in shop interior" />
            </div>
          </div>
          <div className="col-12 col-md-6 order-1 order-md-2">
            <span className="bloom-badge mb-2">Our Story</span>
            <h2 className="display-5 fw-bold mb-4 display-font">Crafting Moments of Beauty</h2>
            <p className="text-bloom-muted mb-3" style={{ lineHeight: '1.7' }}>
              At Bloomora, we believe that flowers are more than just botanical arrangements—they are emotional messages of love, appreciation, celebration, and romantic thoughts.
            </p>
            <p className="text-bloom-muted mb-4" style={{ lineHeight: '1.7' }}>
              Every stem is sourced from premium organic growers and custom arranged in our boutique by passionate visual artists, ensuring that every gift tells a unique, elegant story.
            </p>
            <Link to="/about" className="bloom-btn-secondary text-decoration-none d-inline-flex align-items-center gap-2">
              <span>Read Our Story</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home
