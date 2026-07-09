import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Instagram, ChevronDown, ArrowRight } from 'lucide-react'
import GalleryGrid from '../GalleryGrid'
import GalleryModal from '../components/GalleryModal'
import VideoBlock from '../components/VideoBlock'
import PaintDrip from '../PaintDrip'
import { ARTISTS, type ArtistSlug } from '../data/artists'
import { SERVICES } from '../data/services'

interface Props {
  slug: ArtistSlug
}

export default function ArtistPage({ slug }: Props) {
  const artist = ARTISTS[slug]
  const [current, setCurrent] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)

  useEffect(() => {
    document.title = `${artist.name} — MaTwo Crew`
  }, [artist.name])

  const openGallery = (i: number) => { setCurrent(i); setFullscreen(true) }
  const prev = () => setCurrent((i) => (i - 1 + artist.gallery.length) % artist.gallery.length)
  const next = () => setCurrent((i) => (i + 1) % artist.gallery.length)

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  const letters = artist.name.split('')
  const isPlaceholder = artist.instagram === '#'

  return (
    <main id="main-content">
      {/* HERO */}
      <section
        aria-label={`Présentation de ${artist.name}`}
        className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-5 pt-24 pb-20 overflow-x-hidden"
      >
        <div className="relative z-10 w-full max-w-4xl">
          <h1
            className="mb-8 whitespace-nowrap"
            style={{
              fontFamily: "'Ruwudu', serif",
              fontWeight: 700,
              fontSize: 'clamp(2.25rem, 9vw, 6rem)',
              lineHeight: 1.1,
              color: artist.accent,
            }}
          >
            <span className="hero-title-float hero-spray-reveal inline-block" style={{ paddingTop: '0.12em', paddingBottom: '0.08em' }}>
              {letters.map((l, i) => (
                <span key={i} className="hero-letter" style={{ animationDelay: `${i * 0.1}s` }}>
                  {l}
                </span>
              ))}
            </span>
          </h1>

          {/* Bloc vidéo de présentation */}
          <VideoBlock src={artist.video} label="Présentation" accent={artist.accent} />
        </div>

        <button
          onClick={() => scrollTo('bio')}
          className="absolute bottom-8 text-gray-600 animate-bounce hover:text-gray-400 transition-colors"
          aria-label="Voir la suite"
        >
          <ChevronDown size={28} />
        </button>
      </section>

      {/* BIO */}
      <section id="bio" className="relative py-24 px-5">
        <div className="parallax-bg-text" aria-hidden="true">
          <span data-parallax="0.14">{artist.name}</span>
        </div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="mb-10">
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: artist.accentSoft }}>
              Le parcours
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">L'ARTISTE</h2>
          </div>
          {artist.bio.map((p, i) => (
            <p key={i} className="text-gray-300 text-lg leading-relaxed mb-5">{p}</p>
          ))}
          {isPlaceholder && (
            <p className="mt-4 inline-block text-xs px-3 py-1 rounded-full border border-white/10 text-gray-500 bg-white/5">
              Contenu provisoire — à finaliser avec l'artiste
            </p>
          )}
        </div>
      </section>

      <PaintDrip sectionId="galerie" />

      {/* GALERIE */}
      <section id="galerie" className="relative py-24 px-5" style={{ overflowX: 'clip' }}>
        <div className="parallax-bg-text" aria-hidden="true">
          <span data-parallax="0.12">GRAFFITI</span>
        </div>
        <div className="relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: artist.accent }}>
              Réalisations
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">GALERIE</h2>
          </div>

          <GalleryGrid items={artist.gallery} onOpen={openGallery} />

          {fullscreen && (
            <GalleryModal
              items={artist.gallery}
              current={current}
              onClose={() => setFullscreen(false)}
              onPrev={prev}
              onNext={next}
            />
          )}

          <div className="text-center mt-16">
            {isPlaceholder ? (
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-gray-500">
                <Instagram size={16} />
                Instagram à venir
              </span>
            ) : (
              <a
                href={artist.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/15 text-gray-300 hover:border-white/40 hover:text-white transition-all"
              >
                <Instagram size={16} />
                Voir toutes les réalisations sur Instagram
              </a>
            )}
          </div>
        </div>
      </section>

      <PaintDrip sectionId="services" />

      {/* SERVICES */}
      <section id="services" className="relative py-24 px-5 bg-black/60">
        <div className="parallax-bg-text" aria-hidden="true">
          <span data-parallax="0.18">STREET ART</span>
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: artist.accentSoft }}>
              Ce que je fais
            </p>
            <h2 className="font-display text-5xl md:text-6xl text-white tracking-wider">SERVICES</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {SERVICES.map((s) => {
              const Icon = s.icon
              return (
                <div
                  key={s.title}
                  className="group bg-ink-mid rounded-2xl p-6 border border-white/5 transition-all hover:-translate-y-1"
                  style={{ borderColor: undefined }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${artist.accent}1a` }}
                  >
                    <Icon size={22} style={{ color: artist.accent }} />
                  </div>
                  <h3 className="font-display text-2xl text-white tracking-wide mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.desc}</p>
                  <span className="inline-block text-xs px-3 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10">
                    {s.tag}
                  </span>
                </div>
              )
            })}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-display text-lg tracking-wider text-black transition-transform hover:scale-105"
              style={{ background: artist.accent }}
            >
              Discuter d'un projet
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
