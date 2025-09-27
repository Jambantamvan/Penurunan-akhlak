'use client'

import { useEffect } from 'react'
import { useSurveyStore } from '@/store/survey-store'
import { surveyQuestions } from '@/lib/survey-data'
import { submitSurvey } from '@/lib/api'
import WelcomeScreen from './WelcomeScreen'
import QuestionCard from './QuestionCard'
import ThankYouScreen from './ThankYouScreen'

export default function SurveyFlow() {
  const { 
    currentStep, 
    answers, 
    sessionId, 
    isCompleted,
    isSubmitting,
    setIsSubmitting,
    setRespondentCode,
    completeSurvey,
    nextStep
  } = useSurveyStore()

  // Calculate dynamic values based on survey questions
  const totalQuestions = surveyQuestions.length
  const submissionStep = totalQuestions + 1

  // Handle survey submission when reaching the last question
  useEffect(() => {
    const handleSubmission = async () => {
      if (currentStep === submissionStep && !isCompleted && !isSubmitting && answers.length === totalQuestions) {
        console.log('Starting survey submission...', { sessionId, answers, totalQuestions })
        setIsSubmitting(true)
        
        try {
          const result = await submitSurvey(sessionId, answers)
          console.log('Survey submission result:', result)
          
          if (result.success && result.respondentCode) {
            setRespondentCode(result.respondentCode)
            completeSurvey()
            console.log('Survey submitted successfully with code:', result.respondentCode)
          } else {
            console.error('Failed to submit survey:', result.error)
            alert('Gagal mengirim survey: ' + (result.error || 'Unknown error'))
          }
        } catch (error) {
          console.error('Error submitting survey:', error)
          alert('Terjadi kesalahan saat mengirim survey: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
          setIsSubmitting(false)
        }
      }
    }

    handleSubmission()
  }, [currentStep, answers, sessionId, isCompleted, isSubmitting, setIsSubmitting, setRespondentCode, completeSurvey])

  // Auto-advance to thank you screen after submission
  useEffect(() => {
    if (currentStep === totalQuestions && answers.length === totalQuestions) {
      // Move to submission step
      nextStep()
    }
  }, [currentStep, answers.length, nextStep, totalQuestions])

  // Show loading during submission
  if (currentStep === submissionStep && isSubmitting) {
    return (
      <div className="glass rounded-[var(--radius-glass)] p-12 shadow-[var(--shadow-glass)] text-center">
        <div className="animate-spin w-12 h-12 border-4 border-accent-start border-t-transparent rounded-full mx-auto mb-6"></div>
        <h3 className="text-2xl font-semibold mb-4 text-text-primary">Mengirim Data Survey...</h3>
        <p className="text-text-secondary">Mohon tunggu sebentar, kami sedang memproses jawaban Anda.</p>
      </div>
    )
  }

  // Show thank you screen after successful submission
  if (isCompleted || currentStep === submissionStep) {
    return <ThankYouScreen />
  }

  // Show welcome screen
  if (currentStep === 0) {
    return <WelcomeScreen />
  }

  // Show current question
  const currentQuestion = surveyQuestions[currentStep - 1]
  if (currentQuestion) {
    return (
      <QuestionCard 
        question={currentQuestion}
        isVisible={true}
      />
    )
  }

  // Fallback
  return (
    <div className="glass rounded-[var(--radius-glass)] p-12 shadow-[var(--shadow-glass)] text-center">
      <h3 className="text-2xl font-semibold mb-4 text-text-primary">Survey Error</h3>
      <p className="text-text-secondary mb-6">Terjadi kesalahan dalam memuat survey. Silakan refresh halaman.</p>
      <button 
        onClick={() => window.location.reload()}
        className="btn-primary"
      >
        Refresh Halaman
      </button>
    </div>
  )
}