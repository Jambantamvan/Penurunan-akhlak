'use client'

import { useState } from 'react'

interface UnyLogoProps {
  position?: 'top-left' | 'top-right'
  size?: 'small' | 'medium' | 'large'
}

export default function UnyLogo({ position = 'top-left', size = 'medium' }: UnyLogoProps) {
  const [imageError, setImageError] = useState(false)
  
  const sizeMap = {
    small: { container: 35, image: 24, fontSize: 8 },
    medium: { container: 50, image: 35, fontSize: 10 },
    large: { container: 60, image: 40, fontSize: 12 }
  }
  
  const currentSize = sizeMap[size]
  
  const positionStyles = {
    'top-left': { top: '20px', left: '20px' },
    'top-right': { top: '20px', right: '20px' }
  }

  return (
    <>
      <div 
        className="uny-logo-container"
        style={{ 
          position: 'fixed', 
          ...positionStyles[position],
          zIndex: 1000,
          width: `${currentSize.container}px`,
          height: `${currentSize.container}px`,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.9)',
          border: '2px solid rgba(65, 64, 142, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        {!imageError ? (
          <img 
            src="/uny-logo.png"
            alt="UNY Logo" 
            style={{
              width: `${currentSize.image}px`,
              height: `${currentSize.image}px`,
              objectFit: 'contain',
              aspectRatio: '1/1'
            }}
            onError={() => setImageError(true)}
          />
        ) : (
          <span style={{ 
            color: '#4140E8', 
            fontWeight: 'bold', 
            fontSize: `${currentSize.fontSize}px` 
          }}>
            UNY
          </span>
        )}
      </div>
    </>
  )
}