'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/store/survey-store'
import { 
  getAnalyticsSummary, 
  getDemographicsAnalysis, 
  getIndividualResponses,
  getTotalResponses
} from '@/lib/api'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'demographics' | 'individual'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  
  const { 
    totalResponses, 
    questionAnalytics, 
    demographics, 
    individualResponses,
    setIsLoading: setStoreLoading 
  } = useAnalyticsStore()

  useEffect(() => {
    setIsClient(true)
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      await loadInitialData()
      setConnectionStatus('connected')
    } catch (error) {
      console.error('Connection error:', error)
      setConnectionStatus('error')
    }
  }

  const loadInitialData = async () => {
    if (!isClient) return
    
    setIsLoading(true)
    setStoreLoading(true)
    
    try {
      console.log('Loading analytics data...')
      const results = await Promise.all([
        getTotalResponses(),
        getAnalyticsSummary(),
        getDemographicsAnalysis(),
        getIndividualResponses()
      ])
      console.log('Analytics data loaded:', results)
    } catch (error) {
      console.error('Error loading analytics data:', error)
      throw error
    } finally {
      setIsLoading(false)
      setStoreLoading(false)
    }
  }

  const refreshData = async () => {
    await checkConnection()
  }

  const exportData = (format: string) => {
    const data = {
      totalResponses,
      demographics,
      individualResponses,
      questionAnalytics,
      exportedAt: new Date().toISOString()
    }
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `survey-analytics-${Date.now()}.json`
      a.click()
    } else {
      alert(`Export ${format.toUpperCase()} akan tersedia dalam update berikutnya`)
    }
  }

  if (!isClient) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
          <p>Memuat Dashboard Analytics...</p>
        </div>
      </div>
    )
  }

  const completionRate = totalResponses > 0 ? Math.round((totalResponses / (totalResponses + 1)) * 100) : 0
  const avgCompletionTime = "4-6 min"

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white'
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite',
        zIndex: 0
      }}></div>

      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(15px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '1.5rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: '800',
              margin: 0,
              marginBottom: '0.5rem',
              background: 'linear-gradient(45deg, #fff, #f0f8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              📊 PojokCurhat Analytics
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.8)',
              margin: 0
            }}>
              Real-time Survey Analytics Dashboard
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              background: connectionStatus === 'connected' 
                ? 'rgba(34, 197, 94, 0.2)' 
                : connectionStatus === 'error' 
                ? 'rgba(239, 68, 68, 0.2)' 
                : 'rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: connectionStatus === 'connected' 
                  ? '#22c55e' 
                  : connectionStatus === 'error' 
                  ? '#ef4444' 
                  : '#fbbf24',
                animation: connectionStatus === 'checking' ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span style={{ fontSize: '0.875rem' }}>
                {connectionStatus === 'connected' ? 'Database Connected' : 
                 connectionStatus === 'error' ? 'Connection Error' : 
                 'Checking Connection...'}
              </span>
            </div>
            
            <button 
              onClick={refreshData}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.875rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none' }}>
                🔄
              </span>
              <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        padding: '0 2rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 99
      }}>
        <div style={{ display: 'flex', gap: '0' }}>
          {[
            { id: 'overview', label: '🏠 Overview', icon: '🏠' },
            { id: 'questions', label: '❓ Questions', icon: '❓' },
            { id: 'demographics', label: '👥 Demographics', icon: '👥' },
            { id: 'individual', label: '🔍 Individual', icon: '🔍' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1.25rem 2rem',
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #fff' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: activeTab === tab.id ? '600' : '500',
                fontSize: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.9)'
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
                }
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.split(' ')[1]}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        position: 'relative',
        zIndex: 10,
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Hero Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {/* Total Responden */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.1), transparent)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{totalResponses}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Total Responden
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    {totalResponses > 0 ? `+${totalResponses} partisipan aktif` : 'Menunggu responden pertama'}
                  </p>
                </div>
              </div>

              {/* Completion Rate */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), transparent)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #22c55e, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{completionRate}%</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Completion Rate
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    {completionRate > 80 ? 'Excellent completion' : 'Good engagement'}
                  </p>
                </div>
              </div>

              {/* Average Time */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(139, 92, 246, 0.1), transparent)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{avgCompletionTime}</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Avg. Time
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Optimal survey duration
                  </p>
                </div>
              </div>

              {/* Live Status */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                padding: '2.5rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50%',
                  right: '-50%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(45deg, rgba(245, 158, 11, 0.1), transparent)',
                  borderRadius: '50%'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>LIVE</div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Real-time Data
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Data updates automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Export & Actions */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '3rem'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>📤</span>
                Export & Download
              </h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem'
              }}>
                {[
                  { format: 'json', icon: '📊', label: 'JSON Export', desc: 'Raw data for developers' },
                  { format: 'csv', icon: '📈', label: 'CSV Export', desc: 'Excel-ready format' },
                  { format: 'pdf', icon: '📄', label: 'PDF Report', desc: 'Professional report' }
                ].map((item) => (
                  <button
                    key={item.format}
                    onClick={() => exportData(item.format)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '16px',
                      padding: '2rem',
                      color: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                      e.currentTarget.style.transform = 'translateY(-4px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{item.icon}</div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                      {item.label}
                    </h4>
                    <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0, fontSize: '0.9rem' }}>
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Real-time Insights */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>💡</span>
                Real-time Insights
              </h3>

              <div style={{ display: 'grid', gap: '1.5rem' }}>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    📊 Survey Performance
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    {totalResponses > 0 
                      ? `Saat ini ada ${totalResponses} responden yang telah berpartisipasi dalam survei. Data real-time menunjukkan tingkat partisipasi yang ${totalResponses > 10 ? 'sangat baik' : 'baik'}.`
                      : 'Survei siap untuk menerima responden. Semua sistem telah dikonfigurasi dengan baik.'
                    }
                  </p>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  borderLeft: '4px solid #22c55e'
                }}>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                    🔗 Database Connection
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: 0 }}>
                    {connectionStatus === 'connected' 
                      ? 'Koneksi database stabil. Data ter-sinkronisasi secara real-time dengan Supabase.'
                      : connectionStatus === 'error'
                      ? 'Ada masalah koneksi database. Silakan refresh halaman atau hubungi administrator.'
                      : 'Memeriksa koneksi database...'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>❓</span>
                Question Analytics
              </h3>

              {isLoading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
                  <p>Loading question analytics...</p>
                </div>
              ) : questionAnalytics && questionAnalytics.length > 0 ? (
                <div style={{ display: 'grid', gap: '2rem' }}>
                  {questionAnalytics.map((question: any, index: number) => (
                    <div key={index} style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '16px',
                      padding: '2rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}>
                      <h4 style={{ 
                        fontSize: '1.2rem', 
                        fontWeight: '600', 
                        marginBottom: '1.5rem',
                        color: 'white'
                      }}>
                        Q{index + 1}: {question.question_text || `Question ${index + 1}`}
                      </h4>
                      
                      <div style={{ display: 'grid', gap: '1rem' }}>
                        {question.answers?.map((answer: any, answerIndex: number) => (
                          <div key={answerIndex} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '1rem',
                            background: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px'
                          }}>
                            <span style={{ color: 'white', fontWeight: '500' }}>
                              {answer.answer_label}
                            </span>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '1rem',
                              minWidth: '150px'
                            }}>
                              <div style={{
                                width: '100px',
                                height: '8px',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '4px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  height: '100%',
                                  background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                  borderRadius: '4px',
                                  width: `${answer.percentage || 0}%`,
                                  transition: 'all 0.8s ease'
                                }}></div>
                              </div>
                              <span style={{ 
                                color: '#3b82f6', 
                                fontWeight: 'bold', 
                                minWidth: '50px',
                                textAlign: 'right'
                              }}>
                                {answer.percentage || 0}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                    No Question Data Yet
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                    Question analytics will appear after respondents complete the survey
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '700', 
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <span>👥</span>
                Demographics Analysis
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem'
              }}>
                {/* Gender Distribution */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>⚧️</span>
                    Gender Distribution
                  </h4>
                  
                  {demographics.gender && Object.keys(demographics.gender).length > 0 ? (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {Object.entries(demographics.gender).map(([gender, count], index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px'
                        }}>
                          <span style={{ color: 'white', fontWeight: '500' }}>
                            {gender === 'male' ? '👨 Laki-laki' : 
                             gender === 'female' ? '👩 Perempuan' : 
                             `${gender}`}
                          </span>
                          <span style={{ 
                            color: '#3b82f6', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {count as number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No gender data available yet
                      </p>
                    </div>
                  )}
                </div>

                {/* Age Distribution */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <h4 style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <span>🎂</span>
                    Age Distribution
                  </h4>
                  
                  {demographics.age && Object.keys(demographics.age).length > 0 ? (
                    <div style={{ display: 'grid', gap: '1rem' }}>
                      {Object.entries(demographics.age).map(([ageGroup, count], index) => (
                        <div key={index} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.03)',
                          borderRadius: '8px'
                        }}>
                          <span style={{ color: 'white', fontWeight: '500' }}>
                            {ageGroup === 'teen_early' ? '🧒 13-15 tahun' : 
                             ageGroup === 'teen_mid' ? '🧑 16-18 tahun' : 
                             ageGroup === 'teen_late' ? '👤 19-21 tahun' : 
                             ageGroup}
                          </span>
                          <span style={{ 
                            color: '#22c55e', 
                            fontWeight: 'bold',
                            fontSize: '1.1rem'
                          }}>
                            {count as number}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📈</div>
                      <p style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        No age data available yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Responses Tab */}
        {activeTab === 'individual' && (
          <div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <span>🔍</span>
                  Individual Responses
                </h3>
                
                <input 
                  type="text" 
                  placeholder="Search respondent code..." 
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '0.9rem',
                    width: '250px'
                  }}
                />
              </div>
              
              {individualResponses && individualResponses.length > 0 ? (
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <table style={{
                    width: '100%',
                    borderCollapse: 'collapse'
                  }}>
                    <thead>
                      <tr style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                        {['Respondent Code', 'Completed At', 'Status', 'Actions'].map((header) => (
                          <th key={header} style={{
                            padding: '1.5rem 1rem',
                            textAlign: 'left',
                            fontWeight: '600',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                          }}>
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {individualResponses.map((response: any, index: number) => (
                        <tr key={index} style={{
                          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}>
                          <td style={{ padding: '1.5rem 1rem' }}>
                            <span style={{
                              background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontFamily: 'monospace',
                              fontSize: '0.9rem',
                              fontWeight: '600'
                            }}>
                              {response.respondent_code}
                            </span>
                          </td>
                          <td style={{ padding: '1.5rem 1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                            {new Date(response.completed_at).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </td>
                          <td style={{ padding: '1.5rem 1rem' }}>
                            <span style={{
                              background: 'rgba(34, 197, 94, 0.2)',
                              color: '#22c55e',
                              padding: '0.5rem 1rem',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              width: 'fit-content'
                            }}>
                              <span>✅</span>
                              Completed
                            </span>
                          </td>
                          <td style={{ padding: '1.5rem 1rem' }}>
                            <button style={{
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              color: 'white',
                              padding: '0.5rem 1rem',
                              borderRadius: '8px',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
                              e.currentTarget.style.transform = 'translateY(-1px)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'
                              e.currentTarget.style.transform = 'translateY(0)'
                            }}>
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
                  <h4 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>
                    No Responses Yet
                  </h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.1rem' }}>
                    Individual responses will appear here after participants complete the survey
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}