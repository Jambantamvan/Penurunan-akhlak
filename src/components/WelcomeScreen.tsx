'use client'

import { useSurveyStore } from '@/store/survey-store'
import { surveyQuestions } from '@/lib/survey-data'

export default function WelcomeScreen() {
  const { setCurrentStep } = useSurveyStore()

  const handleStartSurvey = () => {
    // Scroll to top for better mobile UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    setCurrentStep(1)
  }

  return (
    <div className="welcome-card">
      <h2 className="welcome-title">Survey: Penurunan Akhlak Remaja</h2>
      
      <p className="welcome-text">
        Kami mengundang Anda untuk berpartisipasi dalam survey penting tentang fenomena 
        penurunan akhlak remaja yang meliputi perundungan, ujaran kasar, ghibah, dan konten pornografi. 
        Partisipasi Anda akan membantu kami memahami dampaknya terhadap lingkungan sosial 
        dan mencari solusi bersama.
      </p>
      
      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-number">{surveyQuestions.length}</span>
          <span className="stat-label">Pertanyaan</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">5</span>
          <span className="stat-label">Menit</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">100%</span>
          <span className="stat-label">Anonim</span>
        </div>
      </div>

      <button className="btn" onClick={handleStartSurvey}>
        Mulai Survey
      </button>
    </div>
  )
}