import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryItem } from '../data/artists'

interface Props {
  items: GalleryItem[]
  current: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export default function GalleryModal({ items, current, onClose, onPrev, onNext }: Props) {
  const item = items[current]

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.label}
    >
      {item.src ? (
        <img
          src={item.src}
          alt={item.label}
          className="max-w-full max-h-full object-contain rounded-xl"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          className="w-[80vw] max-w-3xl aspect-[7/5] rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #b44fff, #0a0a1a)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <span className="font-display text-3xl tracking-widest text-white/70">{item.label}</span>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Fermer"
      >
        <X size={20} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onPrev() }}
        className="absolute left-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Précédent"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onNext() }}
        className="absolute right-5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        aria-label="Suivant"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  )
}
