'use client'

import { useState } from 'react'
import { exportAllResponses } from '@/lib/api'
import { Download, FileText, Table, Calendar } from 'lucide-react'

export default function ExportButtons() {
  const [isExporting, setIsExporting] = useState(false)

  const exportToCSV = async () => {
    setIsExporting(true)
    try {
      const result = await exportAllResponses()
      if (result.data) {
        // Convert data to CSV
        const csvData = result.data as any[]
        const headers = ['Kode Responden', 'Tanggal Selesai', 'ID Pertanyaan', 'Pertanyaan', 'Jawaban', 'Urutan']
        const csvContent = [
          headers.join(','),
          ...csvData.map(row => [
            row.respondent_code,
            new Date(row.completed_at).toLocaleDateString('id-ID'),
            row.question_id,
            `"${row.question_text}"`,
            `"${row.answer_label}"`,
            row.question_order
          ].join(','))
        ].join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`
        link.click()
      }
    } catch (error) {
      console.error('Error exporting CSV:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  const exportToJSON = async () => {
    setIsExporting(true)
    try {
      const result = await exportAllResponses()
      if (result.data) {
        // Download JSON
        const jsonContent = JSON.stringify(result.data, null, 2)
        const blob = new Blob([jsonContent], { type: 'application/json' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `survey-responses-${new Date().toISOString().split('T')[0]}.json`
        link.click()
      }
    } catch (error) {
      console.error('Error exporting JSON:', error)
      alert('Gagal mengekspor data. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  const generateReport = async () => {
    setIsExporting(true)
    try {
      const result = await exportAllResponses()
      if (result.data) {
        const data = result.data as any[]
        
        // Group data by respondent
        const groupedData = data.reduce((acc: any, item) => {
          if (!acc[item.respondent_code]) {
            acc[item.respondent_code] = {
              respondent_code: item.respondent_code,
              completed_at: item.completed_at,
              responses: []
            }
          }
          acc[item.respondent_code].responses.push(item)
          return acc
        }, {})

        // Generate report content
        const totalResponses = Object.keys(groupedData).length
        const reportDate = new Date().toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })

        let reportContent = `LAPORAN SURVEY PENURUNAN AKHLAK REMAJA\n`
        reportContent += `===========================================\n\n`
        reportContent += `Tanggal Laporan: ${reportDate}\n`
        reportContent += `Total Responden: ${totalResponses}\n\n`
        
        reportContent += `RINGKASAN RESPONDEN:\n`
        reportContent += `-------------------\n`
        
        Object.values(groupedData).forEach((respondent: any) => {
          const responses = respondent.responses.sort((a: any, b: any) => a.question_order - b.question_order)
          reportContent += `\nKode: ${respondent.respondent_code}\n`
          reportContent += `Selesai: ${new Date(respondent.completed_at).toLocaleDateString('id-ID')}\n`
          responses.forEach((response: any) => {
            reportContent += `Q${response.question_order}: ${response.answer_label}\n`
          })
          reportContent += `---\n`
        })

        // Download report
        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8;' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `survey-report-${new Date().toISOString().split('T')[0]}.txt`
        link.click()
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Gagal membuat laporan. Silakan coba lagi.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-xl font-semibold text-text-primary mb-4">Export Data</h3>
      <p className="text-text-secondary mb-6">
        Unduh data survey dalam berbagai format untuk analisis lebih lanjut.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={exportToCSV}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-card-bg rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2 bg-[rgba(102,126,234,0.2)] rounded-lg group-hover:bg-[rgba(102,126,234,0.3)] transition-colors">
            <Table className="w-5 h-5 text-primary-start" />
          </div>
          <div className="text-left">
            <div className="font-medium text-text-primary">Export CSV</div>
            <div className="text-sm text-text-secondary">Untuk analisis spreadsheet</div>
          </div>
          <Download className="w-4 h-4 text-text-secondary ml-auto" />
        </button>

        <button
          onClick={exportToJSON}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-card-bg rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2 bg-[rgba(79,172,254,0.2)] rounded-lg group-hover:bg-[rgba(79,172,254,0.3)] transition-colors">
            <FileText className="w-5 h-5 text-accent-start" />
          </div>
          <div className="text-left">
            <div className="font-medium text-text-primary">Export JSON</div>
            <div className="text-sm text-text-secondary">Untuk pemrosesan data</div>
          </div>
          <Download className="w-4 h-4 text-text-secondary ml-auto" />
        </button>

        <button
          onClick={generateReport}
          disabled={isExporting}
          className="flex items-center gap-3 p-4 bg-card-bg rounded-xl hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <div className="p-2 bg-[rgba(240,147,251,0.2)] rounded-lg group-hover:bg-[rgba(240,147,251,0.3)] transition-colors">
            <Calendar className="w-5 h-5 text-secondary-start" />
          </div>
          <div className="text-left">
            <div className="font-medium text-text-primary">Generate Report</div>
            <div className="text-sm text-text-secondary">Laporan lengkap (.txt)</div>
          </div>
          <Download className="w-4 h-4 text-text-secondary ml-auto" />
        </button>
      </div>

      {isExporting && (
        <div className="mt-4 p-3 bg-[rgba(79,172,254,0.1)] border border-[rgba(79,172,254,0.3)] rounded-xl">
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-accent-start border-t-transparent rounded-full"></div>
            <span className="text-accent-start text-sm">Sedang memproses export...</span>
          </div>
        </div>
      )}
    </div>
  )
}