import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import ScrollToTop from './components/ScrollToTop'
import ScrollProgress from './components/ScrollProgress'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Members from './pages/Members'
import Bots from './pages/Bots'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
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
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/bots" element={<Bots />} />
          <Route path="/skills" element={<Services />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
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
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
