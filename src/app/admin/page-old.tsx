'use client'

import { useEffect, useState } from 'react'
import { useAnalyticsStore } from '@/store/survey-store'
import { 
  getAnalyticsSummary, 
  getDemographicsAnalysis, 
  getIndividualResponses,
  getTotalResponses,
  subscribeToNewResponses,
  unsubscribeFromResponses
} from '@/lib/api'
import BackgroundAnimation from '@/components/BackgroundAnimation'
import Navigation from '@/components/Navigation'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'demographics' | 'individual'>('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const { 
    totalResponses, 
    questionAnalytics, 
    demographics, 
    individualResponses,
    isLoading: storeLoading,
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

  if (!isClient) {
    return <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
      <div className="animate-pulse text-white">Loading...</div>
    </div>
  }

  const completionRate = totalResponses > 0 ? Math.round((totalResponses / totalResponses) * 100) : 0
  const avgCompletionTime = "5-7 min"

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundAnimation />
      <Navigation />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Survey Penurunan Akhlak Remaja - Data & Insights
          </p>
        </div>

        {/* Database Status */}
        <div className="glass rounded-2xl p-6 mb-8 border border-green-500/20 bg-green-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-semibold">Database connected and ready!</span>
            </div>
            <button
              onClick={loadInitialData}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-all duration-200"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 p-2 glass rounded-2xl">
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'questions', label: '📝 Analisis Pertanyaan', icon: '📝' },
            { id: 'demographics', label: '👥 Demografis', icon: '👥' },
            { id: 'individual', label: '📋 Responden Individual', icon: '📋' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-primary text-white shadow-lg transform scale-105'
                  : 'text-text-secondary hover:text-text-primary hover:bg-card-bg'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden md:block">{tab.label.split(' ').slice(1).join(' ')}</span>
            </button>
          ))}
        </div>

        {/* Export Section */}
        <div className="glass rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">Export Data</h3>
          <p className="text-text-secondary text-center mb-6">
            Unduh data survey dalam berbagai format untuk analisis lebih lanjut
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="export-btn group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📊</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-text-primary group-hover:text-blue-400 transition-colors">
                    Export CSV
                  </div>
                  <div className="text-sm text-text-secondary">
                    Untuk analisis spreadsheet
                  </div>
                </div>
              </div>
            </button>

            <button className="export-btn group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-text-primary group-hover:text-green-400 transition-colors">
                    Export JSON
                  </div>
                  <div className="text-sm text-text-secondary">
                    Untuk pemrosesan data
                  </div>
                </div>
              </div>
            </button>

            <button className="export-btn group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">📑</span>
                </div>
                <div className="text-left">
                  <div className="font-semibold text-text-primary group-hover:text-purple-400 transition-colors">
                    Generate Report
                  </div>
                  <div className="text-sm text-text-secondary">
                    Laporan lengkap (.txt)
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon bg-blue-500/20">
                <span className="text-2xl">👥</span>
              </div>
              <div className="text-blue-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div className="stat-number text-blue-400">{totalResponses}</div>
            <div className="stat-label">Total Responden</div>
            <div className="stat-change text-green-400">+{totalResponses} responden</div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon bg-green-500/20">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-green-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/>
                </svg>
              </div>
            </div>
            <div className="stat-number text-green-400">{completionRate}%</div>
            <div className="stat-label">Tingkat Penyelesaian</div>
            <div className="stat-change text-green-400">Sangat baik</div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon bg-purple-500/20">
                <span className="text-2xl">⏱️</span>
              </div>
              <div className="text-purple-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
              </div>
            </div>
            <div className="stat-number text-purple-400">{avgCompletionTime}</div>
            <div className="stat-label">Rata-rata Waktu</div>
            <div className="stat-change text-green-400">Optimal</div>
          </div>

          <div className="stat-card group">
            <div className="flex items-center justify-between mb-4">
              <div className="stat-icon bg-orange-500/20">
                <span className="text-2xl">📈</span>
              </div>
              <div className="text-orange-400 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z"/>
                </svg>
              </div>
            </div>
            <div className="stat-number text-orange-400">Baru saja</div>
            <div className="stat-label">Respons Terakhir</div>
            <div className="stat-change text-green-400">Live update</div>
          </div>
        </div>

        {/* Content Area */}
        <div className="glass rounded-2xl p-8">
          {activeTab === 'overview' && (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-4xl">📊</span>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-4">Dashboard Overview</h3>
              <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                Selamat datang di dashboard analytics PojokCurhat! Pilih tab di atas untuk melihat analisis data yang lebih detail.
              </p>
              <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
                <h4 className="text-xl font-semibold text-text-primary mb-2">📈 Insights Terbaru</h4>
                <p className="text-text-secondary">
                  Data survey akan diupdate secara real-time. Total {totalResponses} responden telah berpartisipasi dalam penelitian ini.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">📝 Analisis Pertanyaan</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-32 bg-card-bg rounded-xl"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-6">
                  {questionAnalytics && questionAnalytics.length > 0 ? (
                    questionAnalytics.map((question: any, index: number) => (
                      <div key={index} className="bg-card-bg rounded-xl p-6 border border-white/10">
                        <h4 className="text-lg font-semibold text-text-primary mb-4">
                          {question.question_text || `Pertanyaan ${index + 1}`}
                        </h4>
                        <div className="space-y-2">
                          {question.answers?.map((answer: any, answerIndex: number) => (
                            <div key={answerIndex} className="flex items-center justify-between">
                              <span className="text-text-secondary">{answer.answer_label}</span>
                              <div className="flex items-center gap-2">
                                <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                                    style={{ width: `${answer.percentage || 0}%` }}
                                  ></div>
                                </div>
                                <span className="text-accent-start font-semibold min-w-[3rem] text-right">
                                  {answer.percentage || 0}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>
                      <h4 className="text-xl font-semibold text-text-primary mb-2">Belum Ada Data</h4>
                      <p className="text-text-secondary">
                        Data analisis pertanyaan akan muncul setelah ada responden
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'demographics' && (
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">👥 Analisis Demografis</h3>
              {isLoading ? (
                <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-64 bg-card-bg rounded-xl"></div>
                  <div className="h-64 bg-card-bg rounded-xl"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-card-bg rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Distribusi Gender</h4>
                    <div className="space-y-3">
                      {demographics.gender && Object.entries(demographics.gender).map(([gender, count], index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-text-secondary">{gender === 'male' ? 'Laki-laki' : gender === 'female' ? 'Perempuan' : gender}</span>
                          <span className="text-accent-start font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-card-bg rounded-xl p-6 border border-white/10">
                    <h4 className="text-lg font-semibold text-text-primary mb-4">Distribusi Usia</h4>
                    <div className="space-y-3">
                      {demographics.age && Object.entries(demographics.age).map(([ageGroup, count], index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-text-secondary">
                            {ageGroup === 'teen_early' ? '13-15 tahun' : 
                             ageGroup === 'teen_mid' ? '16-18 tahun' : 
                             ageGroup === 'teen_late' ? '19-21 tahun' : ageGroup}
                          </span>
                          <span className="text-accent-start font-semibold">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'individual' && (
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-6">📋 Responden Individual</h3>
              {isLoading ? (
                <div className="animate-pulse space-y-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="h-16 bg-card-bg rounded-lg"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {individualResponses.map((response: any, index: number) => (
                    <div key={index} className="bg-card-bg rounded-xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{response.respondent_code}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-text-primary">
                              Responden {response.respondent_code}
                            </div>
                            <div className="text-sm text-text-secondary">
                              {new Date(response.completed_at).toLocaleDateString('id-ID')}
                            </div>
                          </div>
                        </div>
                        <button className="px-4 py-2 bg-accent-start/20 text-accent-start rounded-lg hover:bg-accent-start/30 transition-colors">
                          Lihat Detail
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {individualResponses.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>
                      <h4 className="text-xl font-semibold text-text-primary mb-2">Belum Ada Responden</h4>
                      <p className="text-text-secondary">
                        Data responden akan muncul setelah ada yang mengisi survey
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-white/10">
          <p className="text-text-secondary">
            © 2025 PojokCurhat - Survey Akhlak Remaja Dashboard
          </p>
        </div>
      </div>

      <style jsx>{`
        .export-btn {
          @apply glass rounded-xl p-4 hover:scale-105 transform transition-all duration-200 border border-white/10 hover:border-white/20;
        }

        .stat-card {
          @apply glass rounded-xl p-6 hover:scale-105 transform transition-all duration-200 border border-white/10 hover:border-white/20;
        }

        .stat-icon {
          @apply w-12 h-12 rounded-lg flex items-center justify-center;
        }

        .stat-number {
          @apply text-3xl font-bold mb-2;
        }

        .stat-label {
          @apply text-text-secondary font-medium mb-1;
        }

        .stat-change {
          @apply text-sm font-medium;
        }
      `}</style>
    </div>
  )
}