'use client'

export default function BackgroundAnimation() {
  return (
    <div className="fixed inset-0 z-[-1]">
      {/* Main gradient background with animation */}
      <div 
        className="absolute inset-0 bg-dark-gradient"
        style={{
          animation: 'var(--animate-gradient-shift)',
          backgroundSize: '400% 400%'
        }}
      />
      
      {/* Floating gradient orbs */}
      <div 
        className="absolute inset-0 bg-floating-gradients"
        style={{
          animation: 'var(--animate-float)'
        }}
      />
    </div>
  )
}