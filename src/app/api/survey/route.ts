import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('=== API SURVEY POST CALLED ===')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET')
    console.log('Supabase Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET')
    
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))
    
    const { sessionId, answers } = body

    // Validate input
    if (!sessionId || !answers || !Array.isArray(answers)) {
      console.error('Invalid input:', { sessionId, answers })
      return NextResponse.json(
        { success: false, error: 'Invalid input data' },
        { status: 400 }
      )
    }

    // Validate answers format
    if (answers.length !== 10) {
      console.error('Wrong number of answers:', answers.length)
      return NextResponse.json(
        { success: false, error: 'Survey must have exactly 10 answers' },
        { status: 400 }
      )
    }

    // Check if this session already exists to prevent duplicates
    const { data: existingSurvey, error: checkError } = await supabase
      .from('surveys')
      .select('id, respondent_code')
      .eq('session_id', sessionId)
      .single()

    if (existingSurvey) {
      console.log('Survey already exists for session:', sessionId)
      return NextResponse.json({
        success: true,
        surveyId: existingSurvey.id,
        respondentCode: existingSurvey.respondent_code,
        message: 'Survey already submitted'
      })
    }

    // Prepare responses data for the database function
    const responsesData = answers.map((answer, index) => ({
      question_id: answer.questionId,
      question_text: answer.questionText,
      answer_value: answer.answerValue,
      answer_label: answer.answerLabel,
      question_order: answer.questionOrder || (index + 1)
    }))

    console.log('Prepared responses data:', JSON.stringify(responsesData, null, 2))

    // Call the Supabase function to insert survey with responses
    console.log('Calling Supabase function with:', { sessionId, responsesData })
    const { data, error } = await supabase.rpc('insert_survey_with_responses', {
      session_id_param: sessionId,
      responses_data: responsesData
    })

    console.log('Supabase response:', { data, error })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Database error: ' + error.message 
        },
        { status: 500 }
      )
    }

    // Return success response with respondent code
    console.log('=== SUCCESS - Survey submitted ===')
    return NextResponse.json({
      success: true,
      surveyId: data.survey_id,
      respondentCode: data.respondent_code,
      message: data.message || 'Survey submitted successfully'
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Survey API endpoint is working' },
    { status: 200 }
  )
}