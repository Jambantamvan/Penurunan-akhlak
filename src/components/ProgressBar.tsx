'use client'

interface ProgressBarProps {
  progress: number
  className?: string
}

export default function ProgressBar({ progress, className = '' }: ProgressBarProps) {
  return (
    <div className={`w-full h-2 bg-glass-bg rounded-full overflow-hidden mb-8 ${className}`}>
      <div 
        className="h-full bg-accent-gradient rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  )
}