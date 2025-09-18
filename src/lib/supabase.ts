import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for database tables
export interface Survey {
  id: string
  respondent_code: string
  session_id: string
  completed_at: string
  created_at: string
}

export interface SurveyResponse {
  id: string
  survey_id: string
  respondent_code: string
  question_id: string
  question_text: string
  answer_value: string
  answer_label: string
  question_order: number
  created_at: string
}

export interface AnalyticsSummary {
  question_id: string
  question_text: string
  answer_label: string
  response_count: number
  percentage: number
}

export interface IndividualResponse {
  respondent_code: string
  completed_at: string
  question_id: string
  question_text: string
  answer_label: string
  question_order: number
}

export interface DemographicsAnalysis {
  gender: string
  age_group: string
  respondent_count: number
}