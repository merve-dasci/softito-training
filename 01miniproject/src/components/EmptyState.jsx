import React from 'react'
import { AlertTriangle } from 'lucide-react'

const EmptyState = ({ 
  title = 'No Products Found', 
  message = 'We could not find any products matching your selection. Try clearing filters or using different keywords.', 
  onActionClick, 
  actionText 
}) => {
  return (
    <div className="text-center py-5 my-5 p-5 bloom-card max-width-600 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="d-inline-flex p-3 rounded-circle mb-4" style={{ backgroundColor: 'var(--bloom-secondary)', color: 'var(--bloom-accent)' }}>
        <AlertTriangle size={36} />
      </div>
      <h3 className="fw-bold display-font mb-3">{title}</h3>
      <p className="text-bloom-muted mb-4">{message}</p>
      {onActionClick && actionText && (
        <button 
          onClick={onActionClick}
          className="bloom-btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
