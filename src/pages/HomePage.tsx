import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import PaintDrip from '../PaintDrip'

// Chargé à part : three.js ne bloque pas le rendu initial
const Hero3D = lazy(() => import('../components/Hero3D'))
import { ARTIST_LIST } from '../data/artists'
import { CREW } from '../data/services'

// Teaser : quelques réalisations mixées (Majic réel + placeholders Mavros)
const TEASER = [
  ARTIST_LIST[0].gallery[0],
  ARTIST_LIST[0].gallery[3],
  ARTIST_LIST[1].gallery[0],
  ARTIST_LIST[0].gallery[6],
  ARTIST_LIST[1].gallery[1],
  ARTIST_LIST[0].gallery[8],
]

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    document.title = 'MaTwo Crew — Majic × Mavros · Art mural & Graffiti'
  }, [])

  // Parallax scroll sur les textes de fond
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    const speeds = els.map((el) => parseFloat(el.dataset.parallax || '0.2'))
    const onScroll = () => {
      const y = window.scrollY
      els.forEach((el, i) => {
        el.style.transform = `translateY(${y * speeds[i]}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleHeroMouse = (e: React.MouseEvent) => {
    const r = heroRef.current!.getBoundingClientRect()
    setMouse({
      x: (e.clientX - r.left - r.width / 2) / (r.width / 2),
      y: (e.clientY - r.top - r.height / 2) / (r.height / 2),
    })
  }

  const px = (strength: number) => ({
    transform: `translate(${mouse.x * strength}px, ${mouse.y * strength * 0.65}px)`,
    transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
    willChange: 'transform',
  })

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <main id="main-content">
      {/* HERO CREW */}
      <section
        id="hero"
        ref={heroRef}
        aria-label="MaTwo Crew"
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-5 overflow-x-hidden"
        onMouseMove={handleHeroMouse}
        onMouseLeave={() => setMouse({ x: 0, y: 0 })}
      >
        <div className="relative z-10 w-full max-w-6xl">
          {/* Titre 3D (le h1 accessible reste pour le SEO / lecteurs d'écran) */}
          <h1 className="sr-only">MATWO Crew — Majic × Mavros</h1>
          <Suspense fallback={<div className="h-[38vh] min-h-[240px] md:h-[46vh]" />}>
            <Hero3D />
          </Suspense>

          <p className="font-display text-3xl md:text-5xl tracking-[0.3em] text-gray-300 mt-2" style={px(18)}>
            CREW
          </p>
          <p className="text-gray-400 text-base md:text-lg mt-8 max-w-xl mx-auto" style={px(10)}>
            Le duo graffiti de {CREW.zone} — <span className="text-white">Majic</span> ×{' '}
            <span className="text-white">Mavros</span>. Deux signatures, un seul mur.
          </p>
        </div>

        <button
          onClick={() => scrollTo('duo')}
          className="absolute bottom-8 text-gray-600 animate-bounce hover:text-gray-400 transition-colors"
          aria-label="Découvrir le duo"
        >
          <ChevronDown size={28} />
        </button>
      </section>

      <PaintDrip sectionId="duo" />

      {/* SECTION DUO */}
      <section id="duo" className="relative py-24 px-5" style={{ overflowX: 'clip' }}>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-spray-cyan mb-3">Les artistes</p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">LE CREW</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ARTIST_LIST.map((a) => (
              <Link
                key={a.slug}
                to={`/${a.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-ink-mid p-8 md:p-10 min-h-[280px] flex flex-col justify-end transition-all hover:-translate-y-2"
                style={{ boxShadow: `inset 0 0 0 1px ${a.accent}22` }}
              >
                {/* Halo couleur */}
                <div
                  className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-30 group-hover:opacity-60 transition-opacity"
                  style={{ background: a.accent }}
                  aria-hidden="true"
                />
                <div className="relative z-10">
                  <p className="text-xs tracking-[0.4em] uppercase mb-2" style={{ color: a.accent }}>
                    {a.role}
                  </p>
                  <h3
                    className="text-white mb-3 leading-none"
                    style={{ fontFamily: "'Ruwudu', serif", fontWeight: 700, fontSize: 'clamp(2.8rem, 9vw, 5rem)' }}
                  >
                    {a.name}
                  </h3>
                  <p className="text-gray-400 text-base mb-6">{a.tagline}</p>
                  <span
                    className="inline-flex items-center gap-2 text-sm font-display tracking-widest uppercase transition-colors"
                    style={{ color: a.accent }}
                  >
                    Voir la page
                    <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PaintDrip sectionId="manifeste" />

      {/* MANIFESTE */}
      <section id="manifeste" className="relative py-28 px-5 bg-black/60">
        <div className="parallax-bg-text" aria-hidden="true">
          <span data-parallax="0.16">MATWO</span>
        </div>
        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <p className="text-xs tracking-[0.4em] uppercase text-spray-orange mb-6">Le manifeste</p>
          <p className="text-2xl md:text-3xl leading-relaxed text-gray-200 font-light">
            Deux artistes graffeurs issus de la culture street art, nourris autant par les imaginaires
            des <span className="text-spray-cyan">grandes villes</span> que par ceux des{' '}
            <span className="text-spray-green">territoires ruraux</span>. De ces expériences naît un
            regard singulier : sensible au vivant, aux paysages, à la{' '}
            <span className="text-spray-yellow">faune</span> et à la{' '}
            <span className="text-spray-pink">flore</span>, tout en restant profondément ancré dans la{' '}
            <span className="text-spray-purple">pop culture</span> et l'art urbain.
          </p>
        </div>
      </section>

      <PaintDrip sectionId="apercu" />

      {/* TEASER GALERIE */}
      <section id="apercu" className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.4em] uppercase text-spray-pink mb-3">Aperçu</p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">LEURS MURS</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {TEASER.map((item, i) => (
              <div
                key={i}
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/5"
              >
                {item.src ? (
                  <img
                    src={item.src}
                    alt={item.label}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #b44fff, #0a0a1a)' }}
                  >
                    <span className="font-display text-lg tracking-widest text-white/50">Mavros</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-14">
            <Link
              to="/majic"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-spray-cyan/40 text-spray-cyan hover:bg-spray-cyan/10 transition-all"
            >
              Galerie de Majic <ArrowRight size={16} />
            </Link>
            <Link
              to="/mavros"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full border border-spray-purple/40 text-spray-purple hover:bg-spray-purple/10 transition-all"
            >
              Galerie de Mavros <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA CONTACT */}
      <section className="relative py-28 px-5 text-center">
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="font-display text-4xl md:text-6xl text-white tracking-wider mb-5">
            UN MUR À FAIRE VIVRE ?
          </h2>
          <p className="text-gray-400 mb-10">
            Fresques, décors, événements live, commandes personnalisées. Le crew intervient dans les{' '}
            {CREW.zone} et au-delà.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-9 py-4 rounded-full font-display text-xl tracking-wider text-black bg-white transition-transform hover:scale-105"
          >
            Nous contacter
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </main>
  )
}
