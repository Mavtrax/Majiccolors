import { Play } from 'lucide-react'

interface VideoBlockProps {
  /** Chemin de la vidéo (ex: '/videos/majic.mp4'). Vide → placeholder. */
  src?: string
  /** Image d'attente pendant le chargement (ex: '/videos/majic.jpg'). */
  poster?: string
  label?: string
  /** Couleur d'accent du placeholder. */
  accent?: string
}

export default function VideoBlock({
  src,
  poster,
  label = 'Vidéo de présentation',
  accent = '#ffffff',
}: VideoBlockProps) {
  return (
    <div className="relative w-full max-w-3xl mx-auto aspect-video rounded-2xl overflow-hidden border border-white/10 bg-ink-mid shadow-2xl">
      {src ? (
        <video
          className="w-full h-full object-cover"
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-center px-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: accent, color: accent }}
          >
            <Play size={26} className="ml-1" />
          </div>
          <p className="font-display text-xl tracking-widest text-white">{label}</p>
          <p className="text-gray-500 text-xs uppercase tracking-[0.3em]">Vidéo à venir</p>
        </div>
      )}
    </div>
  )
}
