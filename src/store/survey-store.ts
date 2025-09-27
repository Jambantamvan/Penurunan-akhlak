import { create } from 'zustand'
import { SurveyAnswer, surveyQuestions } from '@/lib/survey-data'

interface SurveyState {
  currentStep: number
  answers: SurveyAnswer[]
  sessionId: string
  respondentCode: string | null
  isCompleted: boolean
  isSubmitting: boolean
  
  // Actions
  setCurrentStep: (step: number) => void
  addAnswer: (answer: SurveyAnswer) => void
  updateAnswer: (questionId: string, answer: SurveyAnswer) => void
  removeAnswer: (questionId: string) => void
  getAnswer: (questionId: string) => SurveyAnswer | undefined
  nextStep: () => void
  previousStep: () => void
  resetSurvey: () => void
  setRespondentCode: (code: string) => void
  setIsSubmitting: (isSubmitting: boolean) => void
  completeSurvey: () => void
  getProgress: () => number
}

// Generate a unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  currentStep: 0, // 0 = welcome screen, 1-N = questions
  answers: [],
  sessionId: generateSessionId(),
  respondentCode: null,
  isCompleted: false,
  isSubmitting: false,

  setCurrentStep: (step: number) => set({ currentStep: step }),

  addAnswer: (answer: SurveyAnswer) => {
    const { answers } = get()
    const existingIndex = answers.findIndex(a => a.questionId === answer.questionId)
    
    if (existingIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answers]
      updatedAnswers[existingIndex] = answer
      set({ answers: updatedAnswers })
    } else {
      // Add new answer
      set({ answers: [...answers, answer] })
    }
  },

  updateAnswer: (questionId: string, answer: SurveyAnswer) => {
    const { answers } = get()
    const updatedAnswers = answers.map(a => 
      a.questionId === questionId ? answer : a
    )
    set({ answers: updatedAnswers })
  },

  removeAnswer: (questionId: string) => {
    const { answers } = get()
    const filteredAnswers = answers.filter(a => a.questionId !== questionId)
    set({ answers: filteredAnswers })
  },

  getAnswer: (questionId: string) => {
    const { answers } = get()
    return answers.find(a => a.questionId === questionId)
  },

  nextStep: () => {
    const { currentStep } = get()
    const totalQuestions = surveyQuestions.length
    if (currentStep <= totalQuestions) {  // Allow going to submission step
      set({ currentStep: currentStep + 1 })
    }
  },

  previousStep: () => {
    const { currentStep } = get()
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 })
    }
  },

  resetSurvey: () => {
    set({
      currentStep: 0,
      answers: [],
      sessionId: generateSessionId(),
      respondentCode: null,
      isCompleted: false,
      isSubmitting: false
    })
  },

  setRespondentCode: (code: string) => set({ respondentCode: code }),

  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

  completeSurvey: () => set({ isCompleted: true }),

  getProgress: () => {
    const { currentStep } = get()
    const totalQuestions = surveyQuestions.length
    if (currentStep === 0) return 0
    return Math.round((currentStep / totalQuestions) * 100)
  }
}))

// Analytics Store for Admin Dashboard
interface AnalyticsState {
  totalResponses: number
  completionRate: number
  demographics: {
    gender: Record<string, number>
    age: Record<string, number>
  }
  questionAnalytics: Array<{
    question_text: string
    answers: Array<{
      answer_label: string
      percentage: number
    }>
  }>
  individualResponses: Array<{
    respondent_code: string
    completed_at: string
    answers?: SurveyAnswer[]
  }>
  isLoading: boolean
  lastUpdated: Date | null

  // Actions
  setTotalResponses: (total: number) => void
  setCompletionRate: (rate: number) => void
  setDemographics: (demographics: any) => void
  setQuestionAnalytics: (analytics: any) => void
  setIndividualResponses: (responses: any) => void
  setIsLoading: (loading: boolean) => void
  refreshData: () => void
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  totalResponses: 0,
  completionRate: 0,
  demographics: {
    gender: {},
    age: {}
  },
  questionAnalytics: [],
  individualResponses: [],
  isLoading: false,
  lastUpdated: null,

  setTotalResponses: (total: number) => set({ totalResponses: total }),
  setCompletionRate: (rate: number) => set({ completionRate: rate }),
  setDemographics: (demographics: any) => set({ demographics }),
  setQuestionAnalytics: (analytics: any) => set({ questionAnalytics: analytics }),
  setIndividualResponses: (responses: any) => set({ individualResponses: responses }),
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),
  
  refreshData: () => {
    set({ lastUpdated: new Date() })
    // This will be implemented when we create the API functions
  }
}))