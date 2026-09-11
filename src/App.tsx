import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar, Footer } from '@/components/layout'
import { HomePage } from '@/pages/Home'
import { ExplorePage } from '@/pages/Explore'
import { ArtifactDetailPage } from '@/pages/ArtifactDetail'
import { DownloadsPage } from '@/pages/Downloads'
import { PublishPage } from '@/pages/Publish'
import { AboutPage } from '@/pages/About'
import { LegalPage } from '@/pages/Legal'
import { SupportPage } from '@/pages/Support'
import { NotFoundPage } from '@/pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/models" element={<ExplorePage kind="model" />} />
          <Route path="/datasets" element={<ExplorePage kind="dataset" />} />
          <Route path="/artifact/:id" element={<ArtifactDetailPage />} />
          <Route path="/downloads" element={<DownloadsPage />} />
          <Route path="/publish" element={<PublishPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
