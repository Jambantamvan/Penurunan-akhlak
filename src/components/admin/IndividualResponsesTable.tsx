'use client'

import React, { useEffect, useState } from 'react'
import { getIndividualResponses, searchResponsesByCode } from '@/lib/api'
import { Search, User, Calendar, ChevronDown, ChevronUp } from 'lucide-react'

interface IndividualResponse {
  respondent_code: string
  completed_at: string
  question_id: string
  question_text: string
  answer_label: string
  question_order: number
}

interface GroupedResponse {
  respondent_code: string
  completed_at: string
  responses: IndividualResponse[]
}

export default function IndividualResponsesTable() {
  const [allResponses, setAllResponses] = useState<IndividualResponse[]>([])
  const [groupedResponses, setGroupedResponses] = useState<GroupedResponse[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    loadIndividualResponses()
  }, [])

  useEffect(() => {
    groupAndFilterResponses()
  }, [allResponses, searchTerm])

  const loadIndividualResponses = async () => {
    try {
      const result = await getIndividualResponses()
      if (result.data) {
        setAllResponses(result.data as IndividualResponse[])
      }
    } catch (error) {
      console.error('Error loading individual responses:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const groupAndFilterResponses = () => {
    // Group responses by respondent code
    const grouped = allResponses.reduce((acc: { [key: string]: GroupedResponse }, response) => {
      const code = response.respondent_code
      
      if (!acc[code]) {
        acc[code] = {
          respondent_code: code,
          completed_at: response.completed_at,
          responses: []
        }
      }
      
      acc[code].responses.push(response)
      return acc
    }, {})

    // Sort responses within each group by question order
    Object.values(grouped).forEach(group => {
      group.responses.sort((a, b) => a.question_order - b.question_order)
    })

    // Filter by search term and convert to array
    const filtered = Object.values(grouped).filter(group =>
      group.respondent_code.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort by completion date (newest first)
    filtered.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())

    setGroupedResponses(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      setIsLoading(true)
      try {
        const result = await searchResponsesByCode(searchTerm.trim())
        if (result.data && result.data.length > 0) {
          // If specific search results found, show only those
          const searchResults = result.data as IndividualResponse[]
          groupAndFilterResponses()
        }
      } catch (error) {
        console.error('Error searching responses:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      groupAndFilterResponses()
    }
  }

  const toggleRowExpansion = (respondentCode: string) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(respondentCode)) {
      newExpanded.delete(respondentCode)
    } else {
      newExpanded.add(respondentCode)
    }
    setExpandedRows(newExpanded)
  }

  const getDemographicsFromResponses = (responses: IndividualResponse[]) => {
    const gender = responses.find(r => r.question_id === 'gender')?.answer_label || 'N/A'
    const age = responses.find(r => r.question_id === 'age')?.answer_label || 'N/A'
    return { gender, age }
  }

  // Pagination
  const totalPages = Math.ceil(groupedResponses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = groupedResponses.slice(startIndex, endIndex)

  if (isLoading) {
    return (
      <div className="glass rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-card-bg rounded w-1/3"></div>
          <div className="h-12 bg-card-bg rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-card-bg rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Summary */}
      <div className="glass rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl font-semibold text-text-primary mb-2">Responden Individual</h3>
            <p className="text-text-secondary">
              Total: {groupedResponses.length} responden | Menampilkan {currentData.length} dari {groupedResponses.length}
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary" />
              <input
                type="text"
                placeholder="Cari kode responden..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-card-bg border border-glass-border rounded-xl text-text-primary placeholder-text-secondary focus:outline-none focus:border-primary-start"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-gradient text-white rounded-xl hover:shadow-[var(--shadow-primary)] transition-all duration-300"
            >
              Cari
            </button>
          </form>
        </div>
      </div>

      {/* Responses Table */}
      <div className="glass rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border">
                <th className="text-left py-4 px-4 text-text-secondary font-medium">Kode Responden</th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">Gender</th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">Usia</th>
                <th className="text-left py-4 px-4 text-text-secondary font-medium">Tanggal Selesai</th>
                <th className="text-center py-4 px-4 text-text-secondary font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((group) => {
                const { gender, age } = getDemographicsFromResponses(group.responses)
                const isExpanded = expandedRows.has(group.respondent_code)
                
                return (
                  <React.Fragment key={group.respondent_code}>
                    <tr className="border-b border-glass-border hover:bg-card-bg transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-accent-start" />
                          <span className="font-bold text-accent-start">{group.respondent_code}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-primary">{gender}</td>
                      <td className="py-4 px-4 text-text-primary">{age}</td>
                      <td className="py-4 px-4 text-text-primary">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-text-secondary" />
                          {new Date(group.completed_at).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => toggleRowExpansion(group.respondent_code)}
                          className="flex items-center gap-1 mx-auto px-3 py-1 bg-card-bg rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                        >
                          {isExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              <span className="text-sm">Tutup</span>
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              <span className="text-sm">Lihat Detail</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr>
                        <td colSpan={5} className="p-0">
                          <div className="bg-[rgba(255,255,255,0.02)] p-6 border-b border-glass-border">
                            <h4 className="text-lg font-semibold text-text-primary mb-4">
                              Detail Jawaban - {group.respondent_code}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {group.responses.map((response, index) => (
                                <div key={index} className="bg-card-bg rounded-xl p-4">
                                  <div className="text-sm text-text-secondary mb-2">
                                    Q{response.question_order}: {response.question_text}
                                  </div>
                                  <div className="text-text-primary font-medium">
                                    {response.answer_label}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 bg-card-bg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              Sebelumnya
            </button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-primary-gradient text-white'
                        : 'bg-card-bg hover:bg-[rgba(255,255,255,0.1)]'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 bg-card-bg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  )
}