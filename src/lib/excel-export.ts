import * as XLSX from 'xlsx'

interface QuestionData {
  question_id: string
  question_text: string
  answer_label: string
  response_count: number
  percentage: number
}

interface ExportData {
  questionId: string
  questionText: string
  data: {
    answer_label: string
    count: number
    percentage: number
  }[]
}

export const exportToExcel = async (analyticsData: QuestionData[], surveyQuestions: any[]) => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new()
    
    // Get unique questions
    const questionIds = [...new Set(analyticsData.map(item => item.question_id))]
    
    // Summary Sheet
    const summaryData = []
    summaryData.push(['LAPORAN ANALISIS SURVEY AKHLAK REMAJA'])
    summaryData.push([''])
    summaryData.push(['Tanggal Export:', new Date().toLocaleDateString('id-ID')])
    summaryData.push(['Total Pertanyaan:', questionIds.length])
    summaryData.push(['Total Responden:', Math.max(...analyticsData.map(item => item.response_count))])
    summaryData.push([''])
    summaryData.push(['RINGKASAN PER PERTANYAAN:'])
    summaryData.push(['No', 'Pertanyaan', 'Total Responden', 'Jawaban Terbanyak', 'Persentase'])
    
    questionIds.forEach((questionId, index) => {
      const questionData = analyticsData.filter(item => item.question_id === questionId)
      const question = surveyQuestions.find(q => q.id === questionId)
      const topAnswer = questionData.reduce((prev, current) => 
        (prev.response_count > current.response_count) ? prev : current
      )
      
      summaryData.push([
        index + 1,
        question?.title || questionId,
        questionData[0]?.response_count || 0,
        topAnswer?.answer_label || '',
        `${topAnswer?.percentage?.toFixed(1) || 0}%`
      ])
    })
    
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    
    // Style the summary sheet
    if (!summarySheet['!merges']) summarySheet['!merges'] = []
    summarySheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } })
    
    // Set column widths
    summarySheet['!cols'] = [
      { width: 5 },   // No
      { width: 40 },  // Pertanyaan
      { width: 15 },  // Total Responden
      { width: 30 },  // Jawaban Terbanyak
      { width: 12 }   // Persentase
    ]
    
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Ringkasan')
    
    // Create detailed sheets for each question
    questionIds.forEach((questionId, index) => {
      const questionData = analyticsData.filter(item => item.question_id === questionId)
      const question = surveyQuestions.find(q => q.id === questionId)
      
      const detailData = []
      detailData.push([`PERTANYAAN ${index + 1}: ${question?.title || questionId}`])
      detailData.push([''])
      detailData.push(['Jawaban', 'Jumlah Responden', 'Persentase'])
      
      questionData.forEach(item => {
        detailData.push([
          item.answer_label,
          item.response_count,
          `${item.percentage.toFixed(1)}%`
        ])
      })
      
      // Add total
      const totalResponses = questionData[0]?.response_count || 0
      detailData.push([''])
      detailData.push(['TOTAL RESPONDEN:', totalResponses, '100.0%'])
      
      // Add pie chart data section
      detailData.push([''])
      detailData.push(['=== DATA UNTUK PIE CHART ==='])
      detailData.push(['Label', 'Value', 'Percentage'])
      questionData.forEach(item => {
        detailData.push([item.answer_label, item.response_count, `${item.percentage.toFixed(1)}%`])
      })
      
      // Add instructions for creating pie chart
      detailData.push([''])
      detailData.push(['=== CARA MEMBUAT PIE CHART ==='])
      detailData.push(['1. Pilih range data Label dan Value (kolom A dan B dari section "DATA UNTUK PIE CHART")'])
      detailData.push(['2. Klik tab INSERT di ribbon Excel'])
      detailData.push(['3. Pilih Charts > Insert Pie or Doughnut Chart'])
      detailData.push(['4. Pilih 2-D Pie Chart (yang pertama)'])
      detailData.push(['5. Chart akan otomatis terbuat!'])
      detailData.push([''])
      detailData.push(['=== TIPS CUSTOMIZE CHART ==='])
      detailData.push(['• Klik kanan chart > Add Data Labels > Show Percentages'])
      detailData.push(['• Klik Chart Title untuk edit nama chart'])
      detailData.push(['• Klik segment pie untuk ubah warna individual'])
      detailData.push(['• Drag chart untuk reposisi dan resize sesuai kebutuhan'])
      
      const detailSheet = XLSX.utils.aoa_to_sheet(detailData)
      
      // Style the detail sheet
      if (!detailSheet['!merges']) detailSheet['!merges'] = []
      detailSheet['!merges'].push({ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } })
      
      detailSheet['!cols'] = [
        { width: 35 },  // Jawaban
        { width: 18 },  // Jumlah
        { width: 12 }   // Persentase
      ]
      
      const sheetName = `Q${index + 1}-${questionId.substring(0, 10)}`
      XLSX.utils.book_append_sheet(workbook, detailSheet, sheetName)
    })
    
    // Create comprehensive data sheet
    const allData = []
    allData.push(['DATA LENGKAP SURVEY'])
    allData.push([''])
    allData.push(['Question ID', 'Pertanyaan', 'Jawaban', 'Jumlah', 'Persentase'])
    
    analyticsData.forEach(item => {
      const question = surveyQuestions.find(q => q.id === item.question_id)
      allData.push([
        item.question_id,
        question?.title || item.question_text,
        item.answer_label,
        item.response_count,
        `${item.percentage.toFixed(1)}%`
      ])
    })
    
    const allDataSheet = XLSX.utils.aoa_to_sheet(allData)
    allDataSheet['!cols'] = [
      { width: 15 },  // Question ID
      { width: 40 },  // Pertanyaan
      { width: 30 },  // Jawaban
      { width: 12 },  // Jumlah
      { width: 12 }   // Persentase
    ]
    
    XLSX.utils.book_append_sheet(workbook, allDataSheet, 'Data Lengkap')
    
    // Create Pie Chart Template Sheet
    const templateData = []
    templateData.push(['TEMPLATE PEMBUATAN PIE CHART'])
    templateData.push([''])
    templateData.push(['Gunakan sheet ini sebagai panduan untuk membuat pie chart untuk setiap pertanyaan.'])
    templateData.push([''])
    templateData.push(['LANGKAH-LANGKAH:'])
    templateData.push(['1. Buka sheet pertanyaan yang ingin dibuat chart-nya (misal: Q1-gender)'])
    templateData.push(['2. Cari section "=== DATA UNTUK PIE CHART ==="'])
    templateData.push(['3. Seleksi data Label dan Value (biasanya 2 kolom)'])
    templateData.push(['4. Insert > Charts > Pie Chart'])
    templateData.push(['5. Customize sesuai kebutuhan'])
    templateData.push([''])
    templateData.push(['CONTOH DATA UNTUK PIE CHART:'])
    templateData.push(['Label', 'Value', 'Keterangan'])
    templateData.push(['Laki-laki', '45', 'Jumlah responden laki-laki'])
    templateData.push(['Perempuan', '55', 'Jumlah responden perempuan'])
    templateData.push([''])
    templateData.push(['TIPS CHART YANG BAGUS:'])
    templateData.push(['• Gunakan warna yang kontras dan mudah dibedakan'])
    templateData.push(['• Tambahkan data labels dengan persentase'])
    templateData.push(['• Beri title yang jelas dan deskriptif'])
    templateData.push(['• Posisikan legend dengan baik'])
    templateData.push(['• Sesuaikan ukuran chart agar proporsional'])
    templateData.push([''])
    templateData.push(['SHORTCUT EXCEL:'])
    templateData.push(['Alt + F1 = Quick Chart Creation'])
    templateData.push(['F11 = Create Chart in New Sheet'])
    templateData.push(['Ctrl + 1 = Format Selected Object'])
    
    const templateSheet = XLSX.utils.aoa_to_sheet(templateData)
    templateSheet['!cols'] = [
      { width: 20 },  // Label/Instruksi
      { width: 15 },  // Value
      { width: 35 }   // Keterangan
    ]
    
    XLSX.utils.book_append_sheet(workbook, templateSheet, 'Tutorial Pie Chart')
    
    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const fileName = `Survey_Akhlak_Remaja_${new Date().toISOString().split('T')[0]}.xlsx`
    
    // Save file
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    
    // For client-side download
    if (typeof window !== 'undefined') {
      const url = window.URL.createObjectURL(data)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      window.URL.revokeObjectURL(url)
    }
    
    return { success: true, fileName }
    
  } catch (error) {
    console.error('Error exporting to Excel:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export const createPieChartInstructions = () => {
  return [
    '',
    'INSTRUKSI MEMBUAT PIE CHART DI EXCEL:',
    '1. Pilih data "Label" dan "Value" untuk setiap pertanyaan',
    '2. Klik Insert > Charts > Pie Chart',
    '3. Pilih 2-D Pie atau 3-D Pie sesuai preferensi',
    '4. Tambahkan Chart Title dengan nama pertanyaan',
    '5. Klik kanan pada chart > Add Data Labels untuk menampilkan persentase',
    '6. Format chart sesuai kebutuhan (warna, style, dll)',
    '',
    'TIPS:',
    '- Gunakan warna yang berbeda untuk setiap segment',
    '- Tambahkan legend untuk clarity',
    '- Sesuaikan ukuran chart agar mudah dibaca'
  ]
}