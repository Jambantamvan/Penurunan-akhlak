'use client'

import { useEffect, useState } from 'react'
import { getAnalyticsSummary } from '@/lib/api'
import { surveyQuestions } from '@/lib/survey-data'
import { SurveyChart } from './SurveyChart'
import { exportToExcel } from '@/lib/excel-export'

interface QuestionData {
  question_id: string
  question_text: string
  answer_label: string
  response_count: number
  percentage: number
}

export default function QuestionAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<QuestionData[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<string>('gender')
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar')
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    loadAnalyticsData()
  }, [])

  const loadAnalyticsData = async () => {
    try {
      const result = await getAnalyticsSummary()
      if (result.data) {
        setAnalyticsData(result.data as QuestionData[])
      }
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportToExcel = async () => {
    setIsExporting(true)
    try {
      const result = await exportToExcel(analyticsData, surveyQuestions)
      if (result.success) {
        alert(`Data berhasil diekspor ke file: ${result.fileName}`)
      } else {
        alert(`Gagal mengekspor data: ${result.error}`)
      }
    } catch (error) {
      alert('Terjadi error saat mengekspor data')
      console.error('Export error:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const getQuestionData = (questionId: string) => {
    const rawData = analyticsData.filter(item => item.question_id === questionId)
    return rawData.map(item => ({
      answer_label: item.answer_label,
      count: item.response_count,
      percentage: item.percentage
    }))
  }

  const getCurrentQuestionTitle = () => {
    const question = surveyQuestions.find(q => q.id === selectedQuestion)
    return question?.title || 'Pertanyaan Tidak Ditemukan'
  }

  if (isLoading) {
    return (
      <div style={{
        padding: '2rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid rgba(102, 126, 234, 0.3)',
          borderTop: '4px solid #667eea',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <div style={{ color: '#ffffff', fontSize: '1.1rem' }}>
          Loading analytics data...
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      padding: '2rem',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Header with Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h2 style={{
          color: '#ffffff',
          fontSize: '1.5rem',
          fontWeight: '700',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📊 Question Analytics
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          {/* Chart Type Toggle */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            padding: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            {(['bar', 'pie'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                style={{
                  background: chartType === type 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : 'transparent',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontWeight: chartType === type ? '600' : '400'
                }}
              >
                {type === 'bar' ? '📊 Bar Chart' : '🥧 Pie Chart'}
              </button>
            ))}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={loadAnalyticsData}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
            }}
          >
            🔄 Refresh
          </button>

          {/* Export to Excel Button */}
          <button
            onClick={handleExportToExcel}
            disabled={isExporting || analyticsData.length === 0}
            style={{
              background: isExporting 
                ? 'rgba(255, 255, 255, 0.1)' 
                : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#ffffff',
              padding: '0.5rem 1rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease',
              opacity: isExporting || analyticsData.length === 0 ? 0.6 : 1
            }}
            onMouseEnter={(e) => {
              if (!isExporting && analyticsData.length > 0) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isExporting && analyticsData.length > 0) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
              }
            }}
          >
            {isExporting ? '⏳ Exporting...' : '📥 Export to Excel'}
          </button>
        </div>
      </div>

      {/* Question Selector */}
      <div style={{
        marginBottom: '2rem'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '1rem'
        }}>
          Select Question to Analyze:
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '0.75rem'
        }}>
          {surveyQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => setSelectedQuestion(question.id)}
              style={{
                background: selectedQuestion === question.id
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '1rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                fontWeight: selectedQuestion === question.id ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (selectedQuestion !== question.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedQuestion !== question.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                {question.title}
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                opacity: 0.8,
                lineHeight: 1.3 
              }}>
                {question.title.length > 60 
                  ? `${question.title.substring(0, 60)}...` 
                  : question.title
                }
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chart Display */}
      <div style={{
        marginTop: '2rem'
      }}>
        <SurveyChart
          questionId={selectedQuestion}
          questionText={getCurrentQuestionTitle()}
          data={getQuestionData(selectedQuestion)}
          chartType={chartType}
        />
      </div>

      {/* Question Statistics */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{
          color: '#ffffff',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          📈 Quick Statistics
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{
            padding: '1rem',
            background: 'rgba(102, 126, 234, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(102, 126, 234, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#667eea', fontSize: '1.5rem', fontWeight: '700' }}>
              {getQuestionData(selectedQuestion).reduce((sum, item) => sum + item.count, 0)}
            </div>
            <div style={{ color: '#ffffff', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Total Responses
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(118, 75, 162, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(118, 75, 162, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#764ba2', fontSize: '1.5rem', fontWeight: '700' }}>
              {getQuestionData(selectedQuestion).length}
            </div>
            <div style={{ color: '#ffffff', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Answer Options
            </div>
          </div>
          
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 119, 198, 0.1)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 119, 198, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ color: '#ff77c6', fontSize: '1.5rem', fontWeight: '700' }}>
              {getQuestionData(selectedQuestion).length > 0 
                ? Math.max(...getQuestionData(selectedQuestion).map(item => item.percentage)).toFixed(1)
                : '0'
              }%
            </div>
            <div style={{ color: '#ffffff', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Highest Percentage
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}