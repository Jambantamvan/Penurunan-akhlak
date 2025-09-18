'use client'

import { useState, useEffect } from 'react'
import { SurveyQuestion, SurveyOption } from '@/lib/survey-data'
import { useSurveyStore } from '@/store/survey-store'
import ProgressBar from './ProgressBar'
import ValidationPopup from './ValidationPopup'

interface QuestionCardProps {
  question: SurveyQuestion
  isVisible: boolean
}

export default function QuestionCard({ question, isVisible }: QuestionCardProps) {
  const { 
    getAnswer, 
    addAnswer, 
    nextStep, 
    previousStep, 
    currentStep, 
    getProgress 
  } = useSurveyStore()
  
  const [selectedOption, setSelectedOption] = useState<string | null>(() => {
    const existingAnswer = getAnswer(question.id)
    return existingAnswer ? existingAnswer.answerValue : null
  })

  const [showValidationPopup, setShowValidationPopup] = useState(false)

  // Update selectedOption when question changes
  useEffect(() => {
    const existingAnswer = getAnswer(question.id)
    setSelectedOption(existingAnswer ? existingAnswer.answerValue : null)
    setShowValidationPopup(false) // Reset validation popup
  }, [question.id, getAnswer])

  const handleOptionSelect = (option: SurveyOption) => {
    setSelectedOption(option.value)
    
    // Store the answer
    addAnswer({
      questionId: question.id,
      questionText: question.title,
      answerValue: option.value,
      answerLabel: option.label,
      questionOrder: question.order
    })
  }

  const handleNext = () => {
    if (!selectedOption) {
      // Show validation popup instead of alert
      setShowValidationPopup(true)
      return
    }
    
    console.log('Moving to next step from:', currentStep, 'to:', currentStep + 1)
    if (currentStep === 10) {
      console.log('This is the last question, submitting survey...')
    }
    
    // Scroll to top for better mobile UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    nextStep()
  }

  const handleBack = () => {
    if (currentStep === 1) {
      // Go back to welcome screen
      useSurveyStore.setState({ currentStep: 0 })
    } else {
      previousStep()
    }
  }

  if (!isVisible) return null

  return (
    <div className="question-card active">
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${getProgress()}%` }}></div>
      </div>
      
      <h3 className="question-title">
        {question.title}
      </h3>
      
      <div className="options-container">
        {question.options.map((option) => (
          <div
            key={option.value}
            onClick={() => handleOptionSelect(option)}
            className={`option ${selectedOption === option.value ? 'selected' : ''}`}
          >
            <div className="option-label">
              {option.label}
            </div>
            {option.description && (
              <div className="option-description">
                {option.description}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="navigation">
        <button
          onClick={handleBack}
          className="btn btn-secondary"
        >
          Kembali
        </button>
        
        <button
          onClick={handleNext}
          className={`btn ${!selectedOption ? 'btn-disabled' : ''}`}
          style={{
            opacity: !selectedOption ? '0.6' : '1',
            cursor: !selectedOption ? 'not-allowed' : 'pointer',
            transform: !selectedOption ? 'none' : undefined
          }}
        >
          {currentStep === 10 ? 'Selesai' : 'Selanjutnya'}
        </button>
      </div>

      {/* Validation Popup */}
      <ValidationPopup
        isVisible={showValidationPopup}
        message="Pertanyaan ini wajib dijawab. Silakan pilih salah satu opsi jawaban sebelum melanjutkan ke pertanyaan berikutnya."
        onClose={() => setShowValidationPopup(false)}
        autoCloseDelay={6000}
      />
    </div>
  )
}