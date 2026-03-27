import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieBanner from './components/CookieBanner'
import ScrollToTop from './components/ScrollToTop'
import ChatWidget from './components/ChatWidget'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
import Impressum from './pages/Impressum'
import Agb from './pages/Agb'
import Privacy from './pages/Privacy'
import Login from './pages/Login'

export default function App() {
  const location = useLocation()

  return (
    <>
      <div className="global-bg" />
      <ScrollToTop />
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/agb" element={<Agb />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <CookieBanner />
      <ChatWidget />
    </>
  )
}
