import React from 'react'
import { HelpCircle, Clock, Calendar, Leaf, Compass, MessageSquare, CreditCard } from 'lucide-react'

const FAQ = () => {
  return (
    <div className="container py-4 bloom-fade-in-up">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="bloom-badge mb-2">Help Center</span>
        <h1 className="display-4 fw-bold display-font">Frequently Asked Questions</h1>
        <p className="text-bloom-muted mx-auto" style={{ maxWidth: '650px' }}>
          Have questions about shipping times, fresh stems care, or gift messages? Find immediate answers below.
        </p>
      </div>

      {/* Accordion container */}
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="accordion border-0" id="bloomoraFaqAccordion">
            
            {/* Q1: How long does flower delivery take? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingOne">
                <button 
                  className="accordion-button display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseOne" 
                  aria-expanded="true" 
                  aria-controls="collapseOne"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <Clock size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>How long does flower delivery take?</span>
                </button>
              </h2>
              <div 
                id="collapseOne" 
                className="accordion-collapse collapse show" 
                aria-labelledby="headingOne" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  Our standard boutique deliveries are completed within **2 to 4 hours** from order confirmation, depending on the recipient's distance from our Blossom District store. You will receive an email tracking link once the delivery vehicle departs.
                </div>
              </div>
            </div>

            {/* Q2: Can I schedule a future delivery? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingTwo">
                <button 
                  className="accordion-button collapsed display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseTwo" 
                  aria-expanded="false" 
                  aria-controls="collapseTwo"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <Calendar size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>Can I schedule a future delivery?</span>
                </button>
              </h2>
              <div 
                id="collapseTwo" 
                className="accordion-collapse collapse" 
                aria-labelledby="headingTwo" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  Yes! During the checkout process, you can select any future date and delivery window (morning, afternoon, or evening) up to **60 days in advance**. This is ideal for planning birthdays, anniversaries, and holidays.
                </div>
              </div>
            </div>

            {/* Q3: How do I keep my flowers fresh? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingThree">
                <button 
                  className="accordion-button collapsed display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseThree" 
                  aria-expanded="false" 
                  aria-controls="collapseThree"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <Leaf size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>How do I keep my flowers fresh?</span>
                </button>
              </h2>
              <div 
                id="collapseThree" 
                className="accordion-collapse collapse" 
                aria-labelledby="headingThree" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  We deliver care instructions with every bouquet. Keep the vase filled with fresh, cool water, cut the stems at a 45-degree angle every 2 days, keep them away from direct sunlight, and add our flower food packet included in the box. Following these steps typically extends their shelf life to **7-10 days**.
                </div>
              </div>
            </div>

            {/* Q4: Do you offer same-day delivery? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingFour">
                <button 
                  className="accordion-button collapsed display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseFour" 
                  aria-expanded="false" 
                  aria-controls="collapseFour"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <Compass size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>Do you offer same-day delivery?</span>
                </button>
              </h2>
              <div 
                id="collapseFour" 
                className="accordion-collapse collapse" 
                aria-labelledby="headingFour" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  Absolutely. We guarantee same-day delivery for all local orders placed before **2:00 PM** local time. Orders placed after 2:00 PM will default to the next day's morning delivery window unless you request an express slot.
                </div>
              </div>
            </div>

            {/* Q5: Can I include a personalized gift note? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingFive">
                <button 
                  className="accordion-button collapsed display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseFive" 
                  aria-expanded="false" 
                  aria-controls="collapseFive"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <MessageSquare size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>Can I include a personalized gift note?</span>
                </button>
              </h2>
              <div 
                id="collapseFive" 
                className="accordion-collapse collapse" 
                aria-labelledby="headingFive" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  Yes, every arrangement can include a hand-written premium card. You can enter your personalized message in the card message box at checkout, and our florists will pen it beautifully on a luxurious textured card.
                </div>
              </div>
            </div>

            {/* Q6: What payment methods are accepted? */}
            <div className="accordion-item border-0 mb-3 bloom-card overflow-hidden">
              <h2 className="accordion-header" id="headingSix">
                <button 
                  className="accordion-button collapsed display-font fw-bold d-flex gap-2 align-items-center" 
                  type="button" 
                  data-bs-toggle="collapse" 
                  data-bs-target="#collapseSix" 
                  aria-expanded="false" 
                  aria-controls="collapseSix"
                  style={{
                    backgroundColor: 'rgba(243, 217, 210, 0.3)',
                    color: 'var(--bloom-text-primary)',
                    fontFamily: 'var(--bloom-font-secondary)',
                    fontSize: '1.05rem',
                    boxShadow: 'none'
                  }}
                >
                  <CreditCard size={18} className="text-bloom-accent flex-shrink-0" style={{ color: 'var(--bloom-accent)' }} />
                  <span>What payment methods are accepted?</span>
                </button>
              </h2>
              <div 
                id="collapseSix" 
                className="accordion-collapse collapse" 
                aria-labelledby="headingSix" 
                data-bs-parent="#bloomoraFaqAccordion"
              >
                <div className="accordion-body bg-white text-bloom-muted p-4" style={{ lineHeight: '1.7' }}>
                  We accept all major credit/debit cards (Visa, MasterCard, American Express) and simulated online wallet transactions. All transactions are securely processed and encrypted.
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default FAQ
