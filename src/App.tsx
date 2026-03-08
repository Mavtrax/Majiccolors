import { useState, useEffect } from 'react'
import { Menu, X, Instagram, MessageCircle, ChevronDown, Brush, PartyPopper, Palette } from 'lucide-react'
import './index.css'

const CONFIG = {
  instagram: 'https://www.instagram.com/majiccolors',
  instagramHandle: '@majiccolors',
}

const SERVICES = [
  {
    icon: Brush,
    title: 'Fresques murales',
    desc: 'Du mur vierge à l\'œuvre d\'art. Création de fresques sur mesure pour particuliers, commerces, collectivités — toutes surfaces, tous formats.',
    tag: 'Sur devis',
  },
  {
    icon: PartyPopper,
    title: 'Événements',
    desc: 'Animation live graffiti pour anniversaires, mariages, soirées, festivals. Un spectacle visuel unique qui marque les esprits.',
    tag: 'Sur devis',
  },
  {
    icon: Palette,
    title: 'Commandes perso',
    desc: 'Canvas, toiles, mobilier, objets personnalisés. Votre prénom, portrait, logo ou univers imaginaire en version street art.',
    tag: 'Sur devis',
  },
]

// Placeholders galerie — à remplacer par les vraies photos
const GALLERY = [
  { src: '', label: 'Tigre coloré' },
  { src: '', label: 'Portrait femme' },
  { src: '', label: 'Pieuvre' },
  { src: '', label: 'Samurai' },
  { src: '', label: 'Œil' },
  { src: '', label: 'Caméléon' },
  { src: '', label: 'Araignée' },
  { src: '', label: 'Mural Majic' },
]

const COLORS = [
  'from-spray-orange to-spray-yellow',
  'from-spray-cyan to-spray-purple',
  'from-spray-pink to-spray-orange',
  'from-spray-green to-spray-cyan',
  'from-spray-purple to-spray-pink',
  'from-spray-yellow to-spray-green',
  'from-spray-orange to-spray-pink',
  'from-spray-cyan to-spray-yellow',
]

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-ink font-body text-gray-100">

      {/* Grain texture */}
      <div className="grain" aria-hidden="true" />

      {/* NAVBAR */}
      <nav
        role="navigation"
        aria-label="Navigation principale"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-ink/95 backdrop-blur border-b border-white/5' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="font-display text-2xl text-white tracking-widest hover:text-spray-orange transition-colors"
          >
            MAJIC<span className="text-spray-orange">.</span>
          </button>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button onClick={() => scrollTo('services')} className="text-gray-400 hover:text-white transition-colors tracking-wide uppercase text-xs">Services</button>
            <button onClick={() => scrollTo('galerie')}  className="text-gray-400 hover:text-white transition-colors tracking-wide uppercase text-xs">Galerie</button>
            <button onClick={() => scrollTo('contact')}  className="text-gray-400 hover:text-white transition-colors tracking-wide uppercase text-xs">Contact</button>
            <a
              href={CONFIG.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-sm"
            >
              <Instagram size={14} />
              Instagram
            </a>
          </div>
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 text-white">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-ink-light border-t border-white/5 px-5 py-5 flex flex-col gap-4">
            <button onClick={() => scrollTo('services')} className="text-left text-gray-300 text-sm uppercase tracking-wide">Services</button>
            <button onClick={() => scrollTo('galerie')}  className="text-left text-gray-300 text-sm uppercase tracking-wide">Galerie</button>
            <button onClick={() => scrollTo('contact')}  className="text-left text-gray-300 text-sm uppercase tracking-wide">Contact</button>
            <a href={CONFIG.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 text-sm">
              <Instagram size={14} /> {CONFIG.instagramHandle}
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <main id="main-content">
      <section id="hero" aria-label="Présentation" className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 overflow-hidden">

        {/* Blobs colorés animés */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="blob1 absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-spray-orange/10 blur-[100px]" />
          <div className="blob2 absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-spray-cyan/10 blur-[120px]" />
          <div className="blob3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-spray-pink/8 blur-[90px]" />
        </div>

        {/* Contenu */}
        <div className="relative z-10 max-w-3xl">
          <p className="text-xs tracking-[0.4em] uppercase text-gray-500 mb-6">Artiste · Graffiti · Muraliste</p>
          <h1 className="font-display text-[6rem] sm:text-[9rem] md:text-[13rem] leading-none text-white mb-4">
            MAJ<span className="text-transparent bg-clip-text bg-gradient-to-r from-spray-orange via-spray-yellow to-spray-pink">IC</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            L'art qui déborde des murs. Fresques, événements, commandes — chaque création est unique.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => scrollTo('galerie')}
              className="px-7 py-3.5 rounded-full bg-spray-orange text-black font-semibold hover:bg-spray-yellow transition-all shadow-lg shadow-spray-orange/20 hover:shadow-spray-yellow/30"
            >
              Voir les réalisations
            </button>
            <button
              onClick={() => scrollTo('contact')}
              className="px-7 py-3.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all"
            >
              Me contacter
            </button>
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

      {/* SERVICES */}
      <section id="services" className="py-24 px-5 bg-ink-light">
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

      {/* GALERIE */}
      <section id="galerie" className="py-24 px-5 bg-ink">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-spray-cyan mb-3">Réalisations</p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">GALERIE</h2>
          </div>

          {/* Grid galerie */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GALLERY.map((item, i) => (
              <div key={i} className={`aspect-square rounded-xl overflow-hidden bg-gradient-to-br ${COLORS[i % COLORS.length]} opacity-60 hover:opacity-100 transition-opacity cursor-pointer`}>
                {item.src ? (
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-black/40 text-xs font-medium">{item.label}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
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

      {/* CTA */}
      <section className="py-24 px-5 bg-ink-light">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider mb-4">
            UN PROJET<span className="text-spray-orange"> ?</span>
          </h2>
          <p className="text-gray-400 leading-relaxed mb-8">
            Fresque murale, animation événementielle ou commande personnalisée — chaque projet est unique. Parlons-en.
          </p>
          <a
            href={CONFIG.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-spray-orange text-black font-semibold hover:bg-spray-yellow transition-all shadow-lg shadow-spray-orange/20"
          >
            <Instagram size={18} />
            Me contacter sur Instagram
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-5 bg-ink">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-spray-pink mb-3">Restons en contact</p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">CONTACT</h2>
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
      </footer>

    </div>
  )
}
