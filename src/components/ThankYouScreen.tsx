'use client'

import { useEffect } from 'react'
import { useSurveyStore } from '@/store/survey-store'

export default function ThankYouScreen() {
  const { respondentCode, resetSurvey } = useSurveyStore()

  // Scroll to top when component mounts for better mobile UX
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  const handleStartNewSurvey = () => {
    // Scroll to top for better mobile UX
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    
    resetSurvey()
  }

  const handleGoToAdmin = () => {
    window.open('/admin', '_blank')
  }

  return (
    <div className="thank-you-card active">
      {/* Success Animation */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ 
          width: '80px', 
          height: '80px', 
          margin: '0 auto 1.5rem', 
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--accent-gradient)',
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }}>
          <span style={{ fontSize: '2.5rem', color: 'white' }}>✓</span>
        </div>
      </div>

      {/* Arabic Thank You */}
      <h2 className="welcome-title" style={{ 
        fontSize: '2.5rem', 
        marginBottom: '1rem',
        background: 'var(--accent-gradient)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        جَزَاكَ اللّٰهُ خَيْرًا 🎉
      </h2>
      
      <p className="welcome-text" style={{ marginBottom: '2rem' }}>
        Survey Anda telah berhasil dikirim. Kontribusi Anda sangat berharga untuk penelitian 
        <span style={{ color: 'var(--accent-start)', fontWeight: '600' }}> &ldquo;Penurunan Akhlak Remaja&rdquo;</span> ini.
      </p>

      {/* Respondent Code */}
      {respondentCode && (
        <div style={{ 
          marginBottom: '2rem', 
          padding: '1.5rem', 
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '16px', 
          border: '1px solid rgba(255, 255, 255, 0.1)' 
        }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Kode Responden Anda:
          </p>
          <p style={{ 
            fontSize: '2rem', 
            fontWeight: '800', 
            background: 'var(--accent-gradient)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textAlign: 'center',
            letterSpacing: '0.2em'
          }}>
            {respondentCode}
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Simpan kode ini sebagai bukti partisipasi Anda
          </p>
        </div>
      )}

      {/* Ayat Al-Quran dengan style yang konsisten */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '2rem', 
        background: 'rgba(255, 255, 255, 0.03)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          fontSize: '1.4rem', 
          color: 'var(--text-primary)', 
          marginBottom: '1rem', 
          lineHeight: '1.8',
          textAlign: 'center',
          fontFamily: 'serif'
        }}>
          وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ
        </div>
        <p style={{ 
          fontSize: '1rem', 
          color: 'var(--text-secondary)', 
          fontStyle: 'italic', 
          marginBottom: '0.5rem',
          textAlign: 'center'
        }}>
          "          &ldquo;Dan barangsiapa bertakwa kepada Allah, niscaya Dia akan membuat jalan keluar baginya, 
          dan Dia memberinya rezeki dari arah yang tidak disangka-sangkanya.&rdquo;"
        </p>
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--accent-start)', 
          fontWeight: '600',
          textAlign: 'center'
        }}>
          (QS. At-Talaq: 2-3)
        </p>
      </div>

      {/* Pesan Penyemangat dengan style grid */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: 'rgba(255, 255, 255, 0.03)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.2rem', 
          fontWeight: '600', 
          color: 'var(--text-primary)', 
          marginBottom: '1rem',
          textAlign: 'center'
        }}>
          💫 Pesan Penyemangat untuk Generasi Muda
        </h3>
        <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: 'var(--accent-start)', fontSize: '1.1rem' }}>🌟</span>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Akhlak mulia</strong> adalah perhiasan terbaik yang bisa kita miliki. 
              Jadilah teladan bagi sesama dan penerus bangsa yang berakhlak karimah.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: 'var(--accent-start)', fontSize: '1.1rem' }}>🚀</span>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Setiap pilihan</strong> yang kita buat hari ini akan menentukan masa depan kita. 
              Pilihlah jalan yang diridhai Allah SWT.
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <span style={{ color: 'var(--accent-start)', fontSize: '1.1rem' }}>🌱</span>
            <span>
              <strong style={{ color: 'var(--text-primary)' }}>Perubahan dimulai dari diri sendiri.</strong> Jadilah agen perubahan positif 
              di lingkungan sekitar dengan memberikan contoh akhlak yang baik.
            </span>
          </div>
        </div>
      </div>

      {/* Stats menggunakan welcome-stats style */}
      <div className="welcome-stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-item">
          <div className="stat-number">10</div>
          <div className="stat-label">Pertanyaan Dijawab</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">✓</div>
          <div className="stat-label">Data Tersimpan</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">🎯</div>
          <div className="stat-label">Survey Selesai</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <button 
          onClick={handleStartNewSurvey}
          className="btn"
          style={{ width: '100%', maxWidth: '300px' }}
        >
          Survey Baru
        </button>
        
        <button
          onClick={handleGoToAdmin}
          className="btn"
          style={{ 
            width: '100%', 
            maxWidth: '300px',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          Lihat Analytics
        </button>
      </div>

      {/* Footer Note */}
      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '1.5rem', 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
      }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
          Data Anda akan digunakan untuk keperluan penelitian akademik dan dijaga kerahasiaannya.
          <br />
          <span style={{ color: 'var(--accent-start)', fontWeight: '500' }}>بَارَكَ اللّٰهُ فِيْكُمْ</span> - Semoga Allah memberkahi kalian
        </p>
      </div>
    </div>
  )
}