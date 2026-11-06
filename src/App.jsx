import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ScrollProgress'
import ChatWidget from './components/ChatWidget'
import FlyingTiles from './components/FlyingTiles'
import Home from './pages/Home'
import About from './pages/About'
import Members from './pages/Members'
import Portfolio from './pages/Portfolio'
import Contact from './pages/Contact'
import Software from './pages/Software'
import GRL from './pages/GRL'
import Impressum from './pages/Impressum'
import Privacy from './pages/Privacy'


// ── Global: Highlight underline draw on scroll ────────────────────
function useHighlightReveal(location) {
  useEffect(() => {
    const timer = setTimeout(() => {
      const highlights = document.querySelectorAll('.highlight:not(.hl-ready)')
      highlights.forEach(el => el.classList.add('hl-ready'))

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (isIntersecting) {
            target.classList.add('hl-visible')
            observer.unobserve(target)
          }
        })
      }, { threshold: 0.6 })

      document.querySelectorAll('.highlight.hl-ready:not(.hl-visible)')
        .forEach(el => observer.observe(el))

      return () => observer.disconnect()
    }, 100)
    return () => clearTimeout(timer)
  }, [location.pathname])
}

function AppInner() {
  const location = useLocation()
  useHighlightReveal(location)

  return (
    <>
      <ScrollProgress />
      <div className="global-bg" />
      <FlyingTiles />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/software" element={<Software />} />
          <Route path="/bots" element={<Navigate to="/software" replace />} />
          <Route path="/downloads" element={<Navigate to="/software" replace />} />
          <Route path="/skills" element={<About />} />
          <Route path="/services" element={<About />} />
          <Route path="/grl" element={<GRL />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </>
  )
}

export default function App() {
  return <AppInner />
}
