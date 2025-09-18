import BackgroundAnimation from '@/components/BackgroundAnimation'
import SurveyFlow from '@/components/SurveyFlow'
import Navigation from '@/components/Navigation'
import UnyLogo from '@/components/UnyLogo'

export default function Home() {
  return (
    <div>
      <BackgroundAnimation />
      
      {/* UNY Logo positioned in top-left corner */}
      <UnyLogo position="top-left" size="medium" />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        {/* Header - UIUX.txt style */}
        <header className="header">
          <h1 className="logo">PojokCurhat</h1>
          <p className="subtitle">Membangun Lingkungan Sosial yang Sehat Bersama</p>
        </header>

        {/* Main Content */}
        <main style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '800px' }}>
            <SurveyFlow />
          </div>
        </main>
      </div>
      
      {/* Navigation positioned absolutely */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
        <Navigation />
      </div>
    </div>
  )
}