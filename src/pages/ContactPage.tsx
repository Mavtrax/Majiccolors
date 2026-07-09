import { useEffect } from 'react'
import { Instagram, MessageCircle, MapPin, FileText } from 'lucide-react'
import { CREW } from '../data/services'

export default function ContactPage() {
  useEffect(() => {
    document.title = 'Contact — MaTwo Crew'
  }, [])

  return (
    <main id="main-content">
      <section className="relative py-28 px-5 min-h-[70vh]">
        <div className="parallax-bg-text" aria-hidden="true">
          <span>CONTACT</span>
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-xs tracking-[0.4em] uppercase text-spray-pink mb-3">Restons en contact</p>
            <h1 className="font-display text-5xl md:text-7xl text-white tracking-wider">CONTACT</h1>
            <p className="text-gray-400 text-base mt-5 max-w-lg mx-auto">
              Un projet de fresque, un mur à habiller, un événement live ? Parlons-en. Le MaTwo Crew
              établit un devis gratuit et personnalisé.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-8">
            <a
              href={CREW.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 bg-ink-mid rounded-2xl p-5 border border-white/5 hover:border-spray-pink/30 transition-all flex-1"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-spray-pink to-spray-purple flex items-center justify-center flex-shrink-0">
                <Instagram size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Instagram</p>
                <p className="text-gray-500 text-sm">{CREW.instagramHandle}</p>
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

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <div className="flex items-center gap-4 bg-ink-mid rounded-2xl p-5 border border-white/5 flex-1">
              <div className="w-12 h-12 rounded-xl bg-spray-cyan/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={22} className="text-spray-cyan" />
              </div>
              <div>
                <p className="text-white font-medium">Zone d'intervention</p>
                <p className="text-gray-500 text-sm">{CREW.zone} & alentours</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-ink-mid rounded-2xl p-5 border border-white/5 flex-1">
              <div className="w-12 h-12 rounded-xl bg-spray-orange/10 flex items-center justify-center flex-shrink-0">
                <FileText size={22} className="text-spray-orange" />
              </div>
              <div>
                <p className="text-white font-medium">Devis</p>
                <p className="text-gray-500 text-sm">Gratuit & sur mesure</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
