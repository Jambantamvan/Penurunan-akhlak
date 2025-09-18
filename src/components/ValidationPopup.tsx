import { useEffect, useState } from 'react'

interface ValidationPopupProps {
  isVisible: boolean
  message: string
  onClose: () => void
  autoCloseDelay?: number
}

export default function ValidationPopup({ 
  isVisible, 
  message, 
  onClose, 
  autoCloseDelay = 6000 
}: ValidationPopupProps) {
  const [timeLeft, setTimeLeft] = useState(autoCloseDelay / 1000)

  useEffect(() => {
    if (!isVisible) return

    // Reset timer when popup becomes visible
    setTimeLeft(autoCloseDelay / 1000)

    // Set up auto-close timer
    const autoCloseTimer = setTimeout(() => {
      onClose()
    }, autoCloseDelay)

    // Set up countdown timer
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(autoCloseTimer)
      clearInterval(countdownTimer)
    }
  }, [isVisible, autoCloseDelay, onClose])

  useEffect(() => {
    if (isVisible) {
      // Prevent background interaction
      document.body.style.overflow = 'hidden'
      
      // Add shake effect after showing
      const timer = setTimeout(() => {
        const container = document.querySelector('.popup-container')
        if (container) {
          container.classList.add('shake')
          setTimeout(() => {
            container.classList.remove('shake')
          }, 600)
        }
      }, 200)

      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ''
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Popup Overlay */}
      <div 
        className={`popup-overlay ${isVisible ? 'show' : ''}`}
        onClick={onClose}
      >
        {/* Popup Container */}
        <div 
          className="popup-container"
          onClick={(e) => e.stopPropagation()}
        >
          <button className="popup-close" onClick={onClose}>×</button>
          
          <div className="popup-header">
            <div className="warning-icon">⚠️</div>
            <h3 className="popup-title">Pertanyaan Wajib!</h3>
          </div>
          
          <div className="popup-body">
            <p className="popup-message">
              {message}
            </p>
            
            <p className="popup-submessage">
              Semua pertanyaan dalam survei ini penting untuk mendapatkan data yang akurat dan representatif.
            </p>
            
            <div className="progress-indicator">
              <p className="progress-text">Menutup otomatis dalam: {timeLeft} detik</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(timeLeft / (autoCloseDelay / 1000)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
            
            <div className="popup-actions">
              <button className="btn btn-primary" onClick={onClose}>
                Mengerti
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(20px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .popup-overlay.show {
          opacity: 1;
          visibility: visible;
        }

        .popup-container {
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 0;
          max-width: 450px;
          width: 90%;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 0 1px rgba(255, 255, 255, 0.1) inset;
          transform: scale(0.8) translateY(20px);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .popup-overlay.show .popup-container {
          transform: scale(1) translateY(0);
        }

        .popup-header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          padding: 2rem 2rem 1rem 2rem;
          text-align: center;
          position: relative;
        }

        .popup-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
        }

        .popup-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: 
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px, 30px 30px, 40px 40px;
          animation: particleFloat 20s linear infinite;
        }

        .warning-icon {
          width: 80px;
          height: 80px;
          margin: 0 auto 1rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          animation: pulseWarning 2s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        .popup-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .popup-body {
          padding: 2rem;
          text-align: center;
        }

        .popup-message {
          font-size: 1.1rem;
          color: #ffffff;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .popup-submessage {
          font-size: 0.95rem;
          color: #b8b8b8;
          margin-bottom: 2rem;
          line-height: 1.5;
        }

        .progress-indicator {
          margin: 1.5rem 0;
          text-align: center;
        }

        .progress-text {
          font-size: 0.9rem;
          color: #b8b8b8;
          margin-bottom: 0.5rem;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
          margin: 0 auto;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 3px;
          transition: width 1s linear;
          animation: progressPulse 2s ease-in-out infinite;
        }

        .popup-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .btn {
          padding: 0.875rem 2rem;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s;
        }

        .btn:hover::before {
          left: 100%;
        }

        .btn-primary {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: white;
          box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 35px rgba(79, 172, 254, 0.4);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .popup-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          font-size: 1.2rem;
          z-index: 2;
        }

        .popup-close:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: rotate(90deg);
        }

        @keyframes pulseWarning {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
          }
        }

        @keyframes progressPulse {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }

        @keyframes particleFloat {
          0% { transform: translateY(0); }
          100% { transform: translateY(-100px); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .shake {
          animation: shake 0.6s ease-in-out;
        }

        @media (max-width: 480px) {
          .popup-container {
            width: 95%;
            margin: 1rem;
          }
          
          .popup-header, .popup-body {
            padding: 1.5rem;
          }
          
          .popup-actions {
            flex-direction: column;
          }
          
          .btn {
            width: 100%;
          }
          
          .warning-icon {
            width: 60px;
            height: 60px;
            font-size: 2rem;
          }
          
          .popup-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  )
}