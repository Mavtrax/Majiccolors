import { useState, useRef } from 'react'
import { X, Instagram, MessageCircle, ChevronDown, ChevronLeft, ChevronRight, Brush, PartyPopper, Palette } from 'lucide-react'
import LiquidBackground from './LiquidBackground'
import GalleryGrid from './GalleryGrid'
import WaterRipple from './WaterRipple'
import './index.css'

const CONFIG = {
  instagram: 'https://www.instagram.com/majiccolors',
  instagramHandle: '@majiccolors',
}

const SERVICES = [
  {
    icon: Brush,
    title: 'Murs & Graff',
    desc: 'Fresques murales sur mesure pour particuliers, commerces et collectivités. Toutes surfaces, tous formats, en intérieur comme en extérieur.',
    tag: 'Sur devis',
  },
  {
    icon: Palette,
    title: 'Décors & Personnages',
    desc: 'Création de décors immersifs et personnages artistiques. Street art, rural art — des univers uniques adaptés à chaque espace.',
    tag: 'Sur devis',
  },
  {
    icon: PartyPopper,
    title: 'Collabs & Projets',
    desc: 'Collaborations artistiques, commandes personnalisées, événements live. Toiles, canvas, objets détournés — parlons de ton projet.',
    tag: 'Sur devis',
  },
]

const GALLERY = [
  { src: encodeURI('/Capture d\'écran 2026-03-08 151928.png'), label: 'Réalisation 1' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152003.png'), label: 'Réalisation 2' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152015.png'), label: 'Réalisation 3' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152031.png'), label: 'Réalisation 4' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152051.png'), label: 'Réalisation 5' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152100.png'), label: 'Réalisation 6' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152107.png'), label: 'Réalisation 7' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152211.png'), label: 'Réalisation 8' },
  { src: encodeURI('/Capture d\'écran 2026-03-08 152234.png'), label: 'Réalisation 9' },
]

export default function App() {
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  // Parallax hero
  const heroRef = useRef<HTMLElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleHeroMouse = (e: React.MouseEvent) => {
    const r = heroRef.current!.getBoundingClientRect()
    setMouse({
      x: (e.clientX - r.left - r.width / 2) / (r.width / 2),
      y: (e.clientY - r.top - r.height / 2) / (r.height / 2),
    })
  }

  const prev = () => setCurrent(i => (i - 1 + GALLERY.length) % GALLERY.length)
  const next = () => setCurrent(i => (i + 1) % GALLERY.length)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const openGallery = (i: number) => { setCurrent(i); setFullscreen(true) }

  // Parallax style helpers — chaque couche à profondeur différente
  const px = (strength: number) => ({
    transform: `translate(${mouse.x * strength}px, ${mouse.y * strength * 0.65}px)`,
    transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94)',
    willChange: 'transform',
  })

  return (
    <div className="min-h-screen font-body text-gray-100">

      {/* Liquid Background global */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: -1 }}>
        <LiquidBackground />
      </div>

      {/* Water ripple */}
      <WaterRipple />

      {/* Grain texture */}
      <div className="grain" aria-hidden="true" />

      {/* HERO */}
      <main id="main-content">
        <section
          id="hero"
          ref={heroRef}
          aria-label="Présentation"
          className="relative min-h-[50vh] flex flex-col items-center justify-center text-center px-5 overflow-x-hidden"
          onMouseMove={handleHeroMouse}
          onMouseLeave={() => setMouse({ x: 0, y: 0 })}
        >
          <div className="relative z-10 max-w-3xl">
            {/* Couche 2 — titre, bouge le plus */}
            <div style={px(40)}>
              <h1
                className="leading-none text-white mb-4 whitespace-nowrap"
                style={{ perspective: '900px', fontFamily: "'Ruwudu', serif", fontWeight: 700, fontSize: 'clamp(2.5rem, 13vw, 16rem)' }}
              >
                <span className="hero-title-float">
                  {['M', 'A', 'J'].map((l, i) => (
                    <span
                      key={l}
                      className="hero-letter"
                      style={{ animationDelay: `${i * 0.12}s` }}
                    >
                      {l}
                    </span>
                  ))}
                  {/* IC — couleurs cycliques */}
                  <span
                    className="hero-letter ic-text"
                    style={{ animationDelay: '0.36s', paddingTop: '0.15em', paddingBottom: '0.05em' }}
                  >
                    IC
                  </span>
                </span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => scrollTo('services')}
            className="absolute bottom-8 text-gray-600 animate-bounce hover:text-gray-400 transition-colors"
            aria-label="Voir les services"
          >
            <ChevronDown size={28} />
          </button>
        </section>

        {/* GALERIE — GRILLE 3D */}
        <section id="galerie" className="relative py-24 px-5" style={{ overflowX: 'clip' }}>
          <div className="relative z-10">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.4em] uppercase text-spray-cyan mb-3">Réalisations</p>
              <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">GALERIE</h2>
            </div>

            <GalleryGrid items={GALLERY} onOpen={openGallery} />

            {/* Modal fullscreen */}
            {fullscreen && (
              <div
                className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                onClick={() => setFullscreen(false)}
              >
                <img
                  src={GALLERY[current].src}
                  alt={GALLERY[current].label}
                  className="max-w-full max-h-full object-contain rounded-xl"
                  onClick={e => e.stopPropagation()}
                />
                <button
                  onClick={() => setFullscreen(false)}
                  className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
                <button onClick={e => { e.stopPropagation(); prev() }} className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <ChevronLeft size={22} />
                </button>
                <button onClick={e => { e.stopPropagation(); next() }} className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                  <ChevronRight size={22} />
                </button>
              </div>
            )}

            <div className="text-center mt-16">
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition-all"
              >
                <Instagram size={16} />
                Voir toutes les réalisations sur Instagram
              </a>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="py-24 px-5 bg-black/60">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.4em] uppercase text-spray-orange mb-3">Ce que je fais</p>
              <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">SERVICES</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SERVICES.map((s) => {
                const Icon = s.icon
                return (
                  <div key={s.title} className="group bg-ink-mid rounded-2xl p-6 border border-white/5 hover:border-spray-orange/30 transition-all hover:-translate-y-1">
                    <div className="w-12 h-12 rounded-xl bg-spray-orange/10 flex items-center justify-center mb-5 group-hover:bg-spray-orange/20 transition-colors">
                      <Icon size={22} className="text-spray-orange" />
                    </div>
                    <h3 className="font-display text-2xl text-white tracking-wide mb-3">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.desc}</p>
                    <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">{s.tag}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="py-24 px-5 bg-black/60">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-xs tracking-[0.4em] uppercase text-spray-pink mb-3">Restons en contact</p>
              <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">CONTACT</h2>
              <p className="text-gray-500 text-sm mt-3">Pyrénées-Atlantiques</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <a
                href={CONFIG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 bg-ink-mid rounded-2xl p-5 border border-white/5 hover:border-spray-pink/30 transition-all flex-1"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-spray-pink to-spray-purple flex items-center justify-center flex-shrink-0">
                  <Instagram size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">Instagram</p>
                  <p className="text-gray-500 text-sm">{CONFIG.instagramHandle}</p>
                </div>
              </a>
              <div className="group flex items-center gap-4 bg-ink-mid rounded-2xl p-5 border border-white/5 flex-1">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={22} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-white font-medium">WhatsApp</p>
                  <p className="text-gray-500 text-sm">À venir</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer role="contentinfo" className="bg-black py-8 px-5 text-center border-t border-white/5">
        <p className="font-display text-xl text-white/30 tracking-widest mb-1">MAJIC COLORS</p>
        <p className="text-xs text-gray-600">© {new Date().getFullYear()} Majic Colors · Tous droits réservés</p>
        <a
          href="https://maverick64.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-700 hover:text-gray-500 transition-colors mt-1 inline-block"
        >
          Réalisé par Maverick Nova
        </a>
      </footer>

    </div>
  )
}
