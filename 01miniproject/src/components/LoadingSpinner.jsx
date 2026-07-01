import React from 'react'

const LoadingSpinner = ({ message = 'Loading fresh arrangements...' }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 my-5">
      <div 
        className="spinner-border" 
        role="status" 
        style={{ 
          width: '3rem', 
          height: '3rem', 
          color: 'var(--bloom-accent)' 
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-bloom-muted font-italic" style={{ fontFamily: 'var(--bloom-font-primary)' }}>
        {message}
      </p>
    </div>
  )
}

export default LoadingSpinner
