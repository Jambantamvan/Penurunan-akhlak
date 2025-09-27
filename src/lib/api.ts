 import { supabase } from './supabase'
import { SurveyAnswer } from './survey-data'

export interface SurveySubmissionResult {
  success: boolean
  surveyId?: string
  respondentCode?: string
  error?: string
}

// Check if we're in demo mode
function isDemoMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL || 
         process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
}

// Check database connectivity and setup
export async function checkDatabaseSetup(): Promise<boolean> {
  if (isDemoMode()) {
    console.log('Running in demo mode - Supabase not configured')
    return false
  }
  
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select('id')
      .limit(1)
    
    if (error) {
      console.error('Database setup check failed:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Database connectivity failed:', error)
    return false
  }
}

export async function submitSurvey(
  sessionId: string,
  answers: SurveyAnswer[]
): Promise<SurveySubmissionResult> {
  try {
    const response = await fetch('/api/survey', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        answers
      })
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || `HTTP ${response.status}`
      }
    }

    return {
      success: result.success,
      surveyId: result.surveyId,
      respondentCode: result.respondentCode
    }

  } catch (error) {
    console.error('Error submitting survey:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

export async function getAnalyticsSummary() {
  try {
    // Check if database is setup
    const isSetup = await checkDatabaseSetup()
    if (!isSetup) {
      return { data: [], error: 'Database belum di-setup' }
    }

    // Try multiple approaches in order of preference
    
    // 1. Try clean_analytics view first (new clean view)
    const cleanResult = await supabase.from('clean_analytics').select('*')
    if (!cleanResult.error && cleanResult.data) {
      return { data: cleanResult.data, error: null }
    }
    
    // 2. Try RPC function
    const { data, error } = await supabase.rpc('get_analytics_summary')
    
    if (!error && data) {
      return { data, error: null }
    }

    // 3. Try new analytics view
    const newViewResult = await supabase.from('survey_analytics_new').select('*')
    if (!newViewResult.error && newViewResult.data) {
      return { data: newViewResult.data, error: null }
    }

    // 4. Try old analytics_summary view
    const viewResult = await supabase.from('analytics_summary').select('*')
    if (!viewResult.error && viewResult.data) {
      return { data: viewResult.data, error: null }
    }

    // 5. Fallback to direct table query
    const { data: rawData, error: rawError } = await supabase
      .from('survey_responses')
      .select(`
        question_id,
        question_text,
        answer_value,
        answer_label
      `)

    if (rawError) {
      console.error('All fallback methods failed:', rawError)
      return { data: [], error: rawError.message }
    }

    // 6. Process data manually
    const processedData = processAnalyticsData(rawData || [])
    return { data: processedData, error: null }

  } catch (error) {
    console.error('Unexpected error fetching analytics:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

// Helper function to process analytics data manually
function processAnalyticsData(rawData: any[]) {
  const groupedData = rawData.reduce((acc, item) => {
    const key = `${item.question_id}-${item.answer_value}`
    if (!acc[key]) {
      acc[key] = {
        question_id: item.question_id,
        question_text: item.question_text,
        answer_value: item.answer_value,
        answer_label: item.answer_label,
        response_count: 0
      }
    }
    acc[key].response_count++
    return acc
  }, {} as any)

  // Calculate percentages
  const questionTotals = Object.values(groupedData).reduce((totals: Record<string, number>, item: any) => {
    const qId = item.question_id
    totals[qId] = (totals[qId] || 0) + item.response_count
    return totals
  }, {})

  return Object.values(groupedData).map((item: any) => ({
    ...item,
    percentage: Math.round((item.response_count * 100) / questionTotals[item.question_id] * 100) / 100
  }))
}

export async function getIndividualResponses() {
  try {
    // 1. Try clean_individual_responses view first
    const cleanResult = await supabase.from('clean_individual_responses').select('*')
    if (!cleanResult.error && cleanResult.data) {
      return { data: cleanResult.data, error: null }
    }
    
    // 2. Try individual_responses view
    const { data, error } = await supabase
      .from('individual_responses')
      .select('*')
      .order('completed_at', { ascending: false })

    if (!error && data) {
      return { data, error: null }
    }

    // 3. Fallback to manual query
    const { data: surveysData, error: surveysError } = await supabase
      .from('surveys')
      .select(`
        survey_id,
        respondent_code,
        created_at
      `)
      .order('created_at', { ascending: false })

    if (surveysError) {
      console.error('Error fetching surveys manually:', surveysError)
      return { data: [], error: surveysError.message }
    }

    const individualData = []
    for (const survey of surveysData || []) {
      const { data: responses } = await supabase
        .from('survey_responses')
        .select('question_id, question_text, answer_value, answer_label')
        .eq('survey_id', survey.survey_id)
        .order('question_id')

      individualData.push({
        survey_id: survey.survey_id,
        respondent_code: survey.respondent_code,
        created_at: survey.created_at,
        total_questions: responses?.length || 0,
        responses: responses || []
      })
    }

    return { data: individualData, error: null }
  } catch (error) {
    console.error('Unexpected error fetching individual responses:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

export async function getDemographicsAnalysis() {
  try {
    // 1. Try clean_demographics view first
    const cleanResult = await supabase.from('clean_demographics').select('*')
    if (!cleanResult.error && cleanResult.data) {
      return { data: cleanResult.data, error: null }
    }
    
    // 2. Try demographics_analysis view
    const { data, error } = await supabase
      .from('demographics_analysis')
      .select('*')

    if (!error && data) {
      return { data, error: null }
    }

    // 3. Fallback to manual query
    const { data: genderData, error: genderError } = await supabase
      .from('survey_responses')
      .select('answer_label')
      .eq('question_id', 'gender')

    const { data: ageData, error: ageError } = await supabase
      .from('survey_responses')
      .select('answer_label')
      .eq('question_id', 'age')

    if (genderError || ageError) {
      console.error('Error fetching demographics manually:', genderError || ageError)
      return { data: [], error: (genderError || ageError)?.message }
    }

    // Process manually
    const demographics = []
    
    // Process gender data
    const genderCounts = (genderData || []).reduce((acc: any, item) => {
      acc[item.answer_label] = (acc[item.answer_label] || 0) + 1
      return acc
    }, {})
    
    Object.entries(genderCounts).forEach(([value, count]) => {
      demographics.push({
        category: 'gender',
        value,
        count,
        percentage: Math.round((count as number * 100) / genderData.length * 100) / 100
      })
    })

    // Process age data  
    const ageCounts = (ageData || []).reduce((acc: any, item) => {
      acc[item.answer_label] = (acc[item.answer_label] || 0) + 1
      return acc
    }, {})
    
    Object.entries(ageCounts).forEach(([value, count]) => {
      demographics.push({
        category: 'age',
        value,
        count,
        percentage: Math.round((count as number * 100) / ageData.length * 100) / 100
      })
    })

    return { data: demographics, error: null }
  } catch (error) {
    console.error('Unexpected error fetching demographics:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

export async function getTotalResponses() {
  try {
    // Check if database is setup
    const isSetup = await checkDatabaseSetup()
    if (!isSetup) {
      return { count: 0, error: 'Database belum di-setup' }
    }

    const { count, error } = await supabase
      .from('surveys')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error fetching total responses:', error)
      return { count: 0, error: error.message }
    }

    return { count: count || 0, error: null }
  } catch (error) {
    console.error('Unexpected error fetching total responses:', error)
    return { count: 0, error: 'An unexpected error occurred' }
  }
}

export async function getResponsesByDateRange(startDate: string, endDate: string) {
  try {
    const { data, error } = await supabase
      .from('surveys')
      .select(`
        *,
        survey_responses (*)
      `)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching responses by date range:', error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error fetching responses by date range:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

export async function searchResponsesByCode(respondentCode: string) {
  try {
    const { data, error } = await supabase
      .from('individual_responses')
      .select('*')
      .eq('respondent_code', respondentCode.toUpperCase())
      .order('question_order', { ascending: true })

    if (error) {
      console.error('Error searching responses by code:', error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error searching responses:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

// Export functions for CSV/Excel
export async function exportAllResponses() {
  try {
    const { data, error } = await supabase
      .from('individual_responses')
      .select('*')
      .order('respondent_code', { ascending: true })

    if (error) {
      console.error('Error exporting all responses:', error)
      return { data: [], error: error.message }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error exporting responses:', error)
    return { data: [], error: 'An unexpected error occurred' }
  }
}

// Real-time subscription for analytics
export function subscribeToNewResponses(callback: (payload: any) => void) {
  const subscription = supabase
    .channel('surveys')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'surveys' 
      }, 
      callback
    )
    .subscribe()

  return subscription
}

export function unsubscribeFromResponses(subscription: any) {
  supabase.removeChannel(subscription)
}