import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { to: '/', label: 'Crew', end: true },
  { to: '/majic', label: 'Majic', end: false },
  { to: '/mavros', label: 'Mavros', end: false },
  { to: '/contact', label: 'Contact', end: false },
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm tracking-widest uppercase transition-colors ${
      isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'
    }`

  return (
    <header className="fixed top-0 inset-x-0 z-40">
      <nav
        aria-label="Navigation principale"
        className="flex items-center justify-between px-5 md:px-8 h-16 bg-black/40 backdrop-blur-md border-b border-white/5"
      >
        <Link
          to="/"
          className="font-display text-2xl tracking-[0.2em] text-white hover:text-spray-cyan transition-colors"
          onClick={() => setOpen(false)}
        >
          MATWO
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-gray-300 hover:text-white transition-colors"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <ul className="md:hidden flex flex-col bg-black/90 backdrop-blur-md border-b border-white/5">
          {LINKS.map((l) => (
            <li key={l.to} className="border-t border-white/5 first:border-t-0">
              <NavLink
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-6 py-4 text-sm tracking-widest uppercase transition-colors ${
                    isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                  }`
                }
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}
