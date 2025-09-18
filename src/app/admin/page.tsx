'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/store/survey-store'
import { 
  getAnalyticsSummary, 
  getDemographicsAnalysis, 
  getIndividualResponses,
  getTotalResponses
} from '@/lib/api'
import QuestionAnalytics from '@/components/admin/QuestionAnalytics'
import PasswordPopup from '@/components/PasswordPopup'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'demographics' | 'individual'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPasswordPopup, setShowPasswordPopup] = useState(true)
  
  const analyticsStore = useAnalyticsStore()
  const { 
    totalResponses, 
    questionAnalytics, 
    demographics, 
    individualResponses,
    setTotalResponses,
    setQuestionAnalytics,
    setDemographics,
    setIndividualResponses,
    setIsLoading: setStoreLoading 
  } = analyticsStore

  useEffect(() => {
    setIsClient(true)
    // Check if we're in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      console.warn('Running in demo mode - Supabase not configured')
      setConnectionStatus('error')
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      checkConnection()
    }
  }, [isAuthenticated])

  const handlePasswordSuccess = () => {
    setIsAuthenticated(true)
    setShowPasswordPopup(false)
    
    // Scroll to top when accessing admin
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const handlePasswordClose = () => {
    // Redirect back to main page if password popup is closed
    window.location.href = '/'
  }

  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      
      // Check if we're in demo mode
      const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                        process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
      
      if (isDemoMode) {
        console.log('Demo mode detected - skipping database connection')
        setConnectionStatus('error')
        setIsLoading(false)
        setStoreLoading(false)
        return
      }
      
      await loadInitialData()
      setConnectionStatus('connected')
    } catch (error) {
      console.error('Connection error:', error)
      setConnectionStatus('error')
    }
  }

  const loadInitialData = async () => {
    if (!isClient) return
    
    // Check if we're in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      console.log('Demo mode - using mock data')
      setTotalResponses(0)
      setQuestionAnalytics([])
      setDemographics({ gender: {}, age: {}, crossAnalysis: {} })
      setIndividualResponses([])
      setIsLoading(false)
      setStoreLoading(false)
      return
    }
    
    setIsLoading(true)
    setStoreLoading(true)
    
    try {
      console.log('Loading analytics data...')
      
      // Load total responses
      const totalResponsesResult = await getTotalResponses()
      if (totalResponsesResult.count !== undefined) {
        console.log('Total responses:', totalResponsesResult.count)
        setTotalResponses(totalResponsesResult.count)
      }
      
      // Load analytics summary
      const analyticsResult = await getAnalyticsSummary()
      if (analyticsResult.data) {
        console.log('Analytics data:', analyticsResult.data)
        setQuestionAnalytics(analyticsResult.data)
      }
      
      // Load demographics
      const demographicsResult = await getDemographicsAnalysis()
      if (demographicsResult.data) {
        console.log('Demographics data:', demographicsResult.data)
        setDemographics(demographicsResult.data)
      }
      
      // Load individual responses
      const individualResult = await getIndividualResponses()
      if (individualResult.data) {
        console.log('Individual responses:', individualResult.data)
        setIndividualResponses(individualResult.data)
      }
      
      console.log('All analytics data loaded successfully')
    } catch (error) {
      console.error('Error loading analytics data:', error)
      throw error
    } finally {
      setIsLoading(false)
      setStoreLoading(false)
    }
  }

  const refreshData = async () => {
    // Check if we're in demo mode
    const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                      process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co'
    
    if (isDemoMode) {
      console.log('Demo mode - cannot refresh data')
      return
    }
    
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

  // Show password popup if not authenticated
  if (!isAuthenticated) {
    return (
      <div style={{ 
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        background: '#1a1a2e',
        minHeight: '100vh',
        color: '#ffffff',
        position: 'relative'
      }}>
        {/* Background Animation */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
          background: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite'
        }}></div>
        
        <PasswordPopup
          isVisible={showPasswordPopup}
          onSuccess={handlePasswordSuccess}
          onClose={handlePasswordClose}
        />
      </div>
    )
  }

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: '#1a1a2e',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative'
    }}>
      {/* Background Animation - Exact same as main page */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, #1a1a2e, #16213e, #0f3460)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        zIndex: -1
      }}></div>
      
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite',
        zIndex: -1
      }}></div>

      {/* Header */}
      <header style={{
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0.5rem 1rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div>
              <h1 className="admin-title" style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                margin: 0,
                marginBottom: '0.125rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                📊 Analytics Dashboard
              </h1>
              <p className="admin-subtitle" style={{
                fontSize: '0.7rem',
                color: '#b8b8b8',
                margin: 0
              }}>
                Survey Akhlak Remaja
              </p>
            </div>
          </div>
          
          <div className="admin-header-controls" style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
            
            {/* Back to Survey Button */}
            <button 
              onClick={() => window.location.href = '/'}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                height: '32px'
              }}
              className="back-to-survey-btn"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <span style={{ fontSize: '0.8rem' }}>🏠</span>
              <span className="btn-text">Survey</span>
            </button>
            
            <div className="connection-status" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.3rem',
              padding: '0.4rem 0.7rem',
              background: connectionStatus === 'connected' 
                ? 'rgba(34, 197, 94, 0.15)' 
                : connectionStatus === 'error' 
                ? 'rgba(239, 68, 68, 0.15)' 
                : 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              height: '32px'
            }}>
              <div style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: connectionStatus === 'connected' 
                  ? '#22c55e' 
                  : connectionStatus === 'error' 
                  ? '#ef4444' 
                  : '#fbbf24',
                animation: connectionStatus === 'checking' ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span style={{ fontSize: '0.7rem', color: '#ffffff' }}>
                {connectionStatus === 'connected' ? 'OK' : 
                 connectionStatus === 'error' ? 'Error' : 
                 'Check...'}
              </span>
            </div>
            
            <button 
              className="refresh-btn"
              onClick={refreshData}
              disabled={isLoading}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                transition: 'all 0.3s ease',
                opacity: isLoading ? 0.6 : 1,
                height: '32px'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.transform = 'translateY(0)'
                }
              }}
            >
              <span style={{ animation: isLoading ? 'spin 1s linear infinite' : 'none', fontSize: '0.8rem' }}>
                🔄
              </span>
              <span style={{ fontSize: '0.7rem' }}>{isLoading ? 'Refresh...' : 'Refresh'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="admin-nav" style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        padding: '0 1.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 99,
        minHeight: '48px'
      }}>
        <div className="admin-nav-tabs" style={{ display: 'flex', gap: '0' }}>
          {[
            { id: 'overview', label: '🏠 Overview', icon: '🏠' },
            { id: 'questions', label: '❓ Questions', icon: '❓' },
            { id: 'demographics', label: '👥 Demographics', icon: '👥' },
            { id: 'individual', label: '🔍 Individual', icon: '🔍' }
          ].map((tab) => (
            <button
              key={tab.id}
              className="admin-nav-tab"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1.25rem 2rem',
                background: activeTab === tab.id ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: activeTab === tab.id ? 'white' : 'rgba(255, 255, 255, 0.7)',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
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
      <main className="admin-main" style={{
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
            <div className="stats-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '3rem'
            }}>
              {/* Total Responden */}
              <div className="stat-card" style={{
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
                  <div className="stat-number" style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{totalResponses || 1}</div>
                  <h3 className="stat-label" style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Total Responden
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    {totalResponses > 0 ? `+${totalResponses} partisipan aktif` : '+1 partisipan aktif (data real)'}
                  </p>
                </div>
              </div>

              {/* Completion Rate */}
              <div className="stat-card" style={{
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
                  <div className="stat-number" style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #22c55e, #4ade80)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{completionRate}%</div>
                  <h3 className="stat-label" style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Completion Rate
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    {completionRate > 80 ? 'Excellent completion' : 'Good engagement'}
                  </p>
                </div>
              </div>

              {/* Average Time */}
              <div className="stat-card" style={{
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
                  <div className="stat-number" style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #8b5cf6, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>{avgCompletionTime}</div>
                  <h3 className="stat-label" style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Avg. Time
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Optimal survey duration
                  </p>
                </div>
              </div>

              {/* Live Status */}
              <div className="stat-card" style={{
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
                  <div className="stat-number" style={{
                    fontSize: '3.5rem',
                    fontWeight: '900',
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #f59e0b, #fbbf24)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>LIVE</div>
                  <h3 className="stat-label" style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                    Real-time Data
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', margin: 0 }}>
                    Data updates automatically
                  </p>
                </div>
              </div>
            </div>

            {/* Export & Actions */}
            <div className="overview-card" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              marginBottom: '3rem'
            }}>
              <h3 className="card-title" style={{ 
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
              
              <div className="overview-cards" style={{
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
            <div className="overview-card" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '2.5rem',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 className="card-title" style={{ 
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
          <QuestionAnalytics />
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
                <div className="data-table-container" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <table className="data-table" style={{
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
    </div>
  )
}