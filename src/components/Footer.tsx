export default function Footer() {
  return (
    <footer role="contentinfo" className="relative z-10 bg-black py-8 px-5 text-center border-t border-white/5">
      <p className="font-display text-xl text-white/30 tracking-widest mb-1">MATWO CREW</p>
      <p className="text-xs text-gray-600">
        © {new Date().getFullYear()} MaTwo Crew · Majic × Mavros · Tous droits réservés
      </p>
      <a
        href="https://maverick64.vercel.app/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-gray-700 hover:text-gray-500 transition-colors mt-1 inline-block"
      >
        Réalisé par Maverick Nova
      </a>
    </footer>
  )
}
