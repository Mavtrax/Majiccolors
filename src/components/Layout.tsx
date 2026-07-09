import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import LiquidBackground from '../LiquidBackground'
import SprayCursor from '../SprayCursor'
import Nav from './Nav'
import Footer from './Footer'

/** Remonte en haut à chaque changement de route */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="min-h-screen font-body text-gray-100">
      {/* Liquid Background global */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <LiquidBackground />
      </div>

      {/* Spray cursor */}
      <SprayCursor />

      {/* Grain texture */}
      <div className="grain" aria-hidden="true" />

      <ScrollToTop />
      <Nav />

      <div className="pt-16">
        <Outlet />
      </div>

      <Footer />
    </div>
  )
}
