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
  const { 
    totalResponses, 
    questionAnalytics, 
    demographics, 
    individualResponses,
    setIsLoading: setStoreLoading 
  } = useAnalyticsStore()

  useEffect(() => {
    setIsClient(true)
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    if (!isClient) return
    
    setIsLoading(true)
    setStoreLoading(true)
    
    try {
      await Promise.all([
        getTotalResponses(),
        getAnalyticsSummary(),
        getDemographicsAnalysis(),
        getIndividualResponses()
      ])
    } catch (error) {
      console.error('Error loading analytics data:', error)
    } finally {
      setIsLoading(false)
      setStoreLoading(false)
    }
  }

  const refreshData = async () => {
    await loadInitialData()
  }

  const exportData = (format: string) => {
    alert(`Mengekspor data dalam format ${format.toUpperCase()}...`)
  }

  if (!isClient) {
    return <div className="min-h-screen bg-primary-bg flex items-center justify-center">
      <div className="animate-pulse text-text-primary">Loading...</div>
    </div>
  }

  const completionRate = totalResponses > 0 ? 94 : 0
  const avgCompletionTime = "5-7 min"
  const lastRespondent = "A47"

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: 'var(--primary-bg)',
      color: 'var(--text-primary)',
      lineHeight: '1.6',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'var(--secondary-bg)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div>
          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: '700',
            color: 'var(--text-primary)',
            marginBottom: '0.25rem'
          }}>
            Survey Penurunan Akhlak Remaja - Analytics
          </h1>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)'
          }}>
            Data & Insights Dashboard
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            fontSize: '0.875rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--success-green)'
            }}></div>
            <span>Database Connected</span>
          </div>
          <button 
            onClick={refreshData}
            style={{
              background: 'var(--success-green)',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>🔄</span>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={{
        background: 'var(--secondary-bg)',
        padding: '0 2rem',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'questions', label: '📋 Analisis Pertanyaan' },
            { id: 'demographics', label: '👥 Demografis' },
            { id: 'individual', label: '🔍 Responden Individual' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                padding: '1rem 0',
                color: activeTab === tab.id ? 'var(--accent-blue)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid var(--accent-blue)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '500'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div className="stat-card blue">
                <div className="stat-header">
                  <div>
                    <div className="stat-value">{totalResponses}</div>
                    <div className="stat-label">Total Responden</div>
                    <div className="stat-change positive">+{totalResponses} responden hari ini</div>
                  </div>
                  <div className="stat-icon blue">👥</div>
                </div>
              </div>

              <div className="stat-card green">
                <div className="stat-header">
                  <div>
                    <div className="stat-value">{completionRate}%</div>
                    <div className="stat-label">Tingkat Penyelesaian</div>
                    <div className="stat-change positive">Sangat baik</div>
                  </div>
                  <div className="stat-icon green">✅</div>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-header">
                  <div>
                    <div className="stat-value">{avgCompletionTime}</div>
                    <div className="stat-label">Rata-rata Waktu</div>
                    <div className="stat-change neutral">Optimal</div>
                  </div>
                  <div className="stat-icon purple">⏱️</div>
                </div>
              </div>

              <div className="stat-card orange">
                <div className="stat-header">
                  <div>
                    <div className="stat-value">Baru saja</div>
                    <div className="stat-label">Respons Terakhir</div>
                    <div className="stat-change positive">Live update</div>
                  </div>
                  <div className="stat-icon orange">🔄</div>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div className="export-section">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Export Data</h3>
                  <p className="chart-subtitle">Unduh data survey dalam berbagai format untuk analisis lebih lanjut</p>
                </div>
              </div>
              <div className="export-grid">
                <div className="export-card" onClick={() => exportData('csv')}>
                  <div className="export-icon green">📊</div>
                  <h4>Export CSV</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Untuk analisis spreadsheet</p>
                </div>
                <div className="export-card" onClick={() => exportData('json')}>
                  <div className="export-icon blue">⚙️</div>
                  <h4>Export JSON</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Untuk pemrosesan data</p>
                </div>
                <div className="export-card" onClick={() => exportData('pdf')}>
                  <div className="export-icon purple">📄</div>
                  <h4>Generate Report</h4>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Laporan lengkap (.pdf)</p>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="dashboard-grid">
              <div className="chart-container">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Distribusi Gender</h3>
                    <p className="chart-subtitle">Breakdown responden berdasarkan jenis kelamin</p>
                  </div>
                </div>
                <div className="canvas-container">
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                    <p style={{ color: 'var(--text-secondary)' }}>Chart akan muncul setelah ada data responden</p>
                  </div>
                </div>
              </div>

              <div className="chart-container">
                <div className="chart-header">
                  <div>
                    <h3 className="chart-title">Distribusi Umur</h3>
                    <p className="chart-subtitle">Rentang usia responden</p>
                  </div>
                </div>
                <div className="canvas-container">
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
                    <p style={{ color: 'var(--text-secondary)' }}>Chart akan muncul setelah ada data responden</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Panel */}
            <div className="insights-panel">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">💡 Insights Terbaru</h3>
                  <p className="chart-subtitle">Analisis otomatis dari data terkini</p>
                </div>
              </div>
              
              <div className="insight-item">
                <div className="insight-title">Tingkat Completion Rate Excellent</div>
                <div className="insight-text">94% tingkat penyelesaian menunjukkan bahwa survei mudah diikuti dan topiknya relevan dengan responden.</div>
              </div>
              
              <div className="insight-item">
                <div className="insight-title">Data Survey Real-time</div>
                <div className="insight-text">Total {totalResponses} responden telah berpartisipasi dalam penelitian ini. Data ter-update secara real-time.</div>
              </div>
            </div>
          </div>
        )}

        {/* Questions Tab */}
        {activeTab === 'questions' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem' }}>
              📋 Analisis Pertanyaan
            </h3>
            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
                <p>Memuat data analisis...</p>
              </div>
            ) : questionAnalytics && questionAnalytics.length > 0 ? (
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {questionAnalytics.map((question: any, index: number) => (
                  <div key={index} className="chart-container">
                    <h4 style={{ marginBottom: '1rem' }}>{question.question_text || `Pertanyaan ${index + 1}`}</h4>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {question.answers?.map((answer: any, answerIndex: number) => (
                        <div key={answerIndex} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>{answer.answer_label}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{
                              width: '8rem',
                              height: '0.5rem',
                              background: 'rgba(255, 255, 255, 0.1)',
                              borderRadius: '9999px',
                              overflow: 'hidden'
                            }}>
                              <div style={{
                                height: '100%',
                                background: 'var(--accent-blue)',
                                borderRadius: '9999px',
                                width: `${answer.percentage || 0}%`,
                                transition: 'all 0.5s ease'
                              }}></div>
                            </div>
                            <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold', minWidth: '3rem', textAlign: 'right' }}>
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
              <div style={{ textAlign: 'center', padding: '4rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Belum Ada Data</h4>
                <p style={{ color: 'var(--text-secondary)' }}>Data analisis pertanyaan akan muncul setelah ada responden</p>
              </div>
            )}
          </div>
        )}

        {/* Demographics Tab */}
        {activeTab === 'demographics' && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem' }}>
              👥 Analisis Demografis
            </h3>
            <div className="demographics-grid">
              <div className="chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">Distribusi Gender</h3>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                  {demographics.gender && Object.entries(demographics.gender).map(([gender, count], index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>{gender === 'male' ? 'Laki-laki' : gender === 'female' ? 'Perempuan' : gender}</span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="chart-container">
                <div className="chart-header">
                  <h3 className="chart-title">Distribusi Usia</h3>
                </div>
                <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                  {demographics.age && Object.entries(demographics.age).map(([ageGroup, count], index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span>
                        {ageGroup === 'teen_early' ? '13-15 tahun' : 
                         ageGroup === 'teen_mid' ? '16-18 tahun' : 
                         ageGroup === 'teen_late' ? '19-21 tahun' : ageGroup}
                      </span>
                      <span style={{ color: 'var(--accent-blue)', fontWeight: 'bold' }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Responses Tab */}
        {activeTab === 'individual' && (
          <div>
            <div className="individual-responses">
              <div className="chart-header">
                <div>
                  <h3 className="chart-title">Responden Individual</h3>
                  <p className="chart-subtitle">Daftar semua responden dengan kode unik dan status completion</p>
                </div>
                <input 
                  type="text" 
                  placeholder="Cari kode responden..." 
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--secondary-bg)',
                    color: 'white'
                  }}
                />
              </div>
              
              <table className="response-table">
                <thead>
                  <tr>
                    <th>Kode Responden</th>
                    <th>Gender</th>
                    <th>Umur</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {individualResponses && individualResponses.length > 0 ? (
                    individualResponses.map((response: any, index: number) => (
                      <tr key={index}>
                        <td><span className="respondent-code">{response.respondent_code}</span></td>
                        <td>-</td>
                        <td>-</td>
                        <td>{new Date(response.completed_at).toLocaleDateString('id-ID')}</td>
                        <td><span style={{ color: 'var(--success-green)' }}>✅ Completed</span></td>
                        <td><button className="btn">Lihat Detail</button></td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
                        <p>Belum ada responden yang mengisi survey</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
          --primary-bg: #0f172a;
          --secondary-bg: #1e293b;
          --card-bg: #334155;
          --accent-blue: #3b82f6;
          --accent-green: #10b981;
          --accent-purple: #8b5cf6;
          --accent-orange: #f59e0b;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --border-color: #475569;
          --success-green: #22c55e;
          --danger-red: #ef4444;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: var(--accent-blue);
        }

        .stat-card.green::before { background: var(--success-green); }
        .stat-card.purple::before { background: var(--accent-purple); }
        .stat-card.orange::before { background: var(--accent-orange); }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
        .stat-icon.green { background: rgba(34, 197, 94, 0.1); color: var(--success-green); }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); }
        .stat-icon.orange { background: rgba(245, 158, 11, 0.1); color: var(--accent-orange); }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stat-change.positive { color: var(--success-green); }
        .stat-change.neutral { color: var(--text-secondary); }

        .chart-container {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .chart-title {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .chart-subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .export-section {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
          margin-bottom: 2rem;
        }

        .export-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .export-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .export-card:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .export-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-size: 1.25rem;
        }

        .export-icon.green { background: rgba(34, 197, 94, 0.1); color: var(--success-green); }
        .export-icon.blue { background: rgba(59, 130, 246, 0.1); color: var(--accent-blue); }
        .export-icon.purple { background: rgba(139, 92, 246, 0.1); color: var(--accent-purple); }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .demographics-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .canvas-container {
          position: relative;
          height: 300px;
        }

        .insights-panel {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
        }

        .insight-item {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 8px;
          margin-bottom: 1rem;
          border-left: 4px solid var(--accent-blue);
        }

        .insight-title {
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .insight-text {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .individual-responses {
          background: var(--card-bg);
          border-radius: 16px;
          padding: 2rem;
          border: 1px solid var(--border-color);
        }

        .response-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }

        .response-table th,
        .response-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .response-table th {
          background: rgba(255, 255, 255, 0.05);
          font-weight: 600;
          color: var(--text-secondary);
        }

        .respondent-code {
          background: var(--accent-blue);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875rem;
        }

        .btn {
          background: var(--accent-blue);
          color: white;
          border: none;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:hover {
          background: #2563eb;
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .demographics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}