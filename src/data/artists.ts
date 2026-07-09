// Données des artistes du MaTwo Crew.
// Majic = contenu réel. Mavros = placeholders à remplacer après le RDV.

export type ArtistSlug = 'majic' | 'mavros'

export interface GalleryItem {
  src: string
  label: string
}

export interface Artist {
  slug: ArtistSlug
  name: string
  role: string
  tagline: string
  bio: string[]
  instagram: string
  instagramHandle: string
  /** Couleur d'accent dominante (hex, tokens spray.*) */
  accent: string
  accentSoft: string
  gallery: GalleryItem[]
}

const MAJIC_GALLERY: GalleryItem[] = [
  { src: encodeURI("/Capture d'écran 2026-03-08 151928.png"), label: 'Réalisation 1' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152003.png"), label: 'Réalisation 2' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152015.png"), label: 'Réalisation 3' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152031.png"), label: 'Réalisation 4' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152051.png"), label: 'Réalisation 5' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152100.png"), label: 'Réalisation 6' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152107.png"), label: 'Réalisation 7' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152211.png"), label: 'Réalisation 8' },
  { src: encodeURI("/Capture d'écran 2026-03-08 152234.png"), label: 'Réalisation 9' },
]

// TODO: contenu réel après RDV — src vide = fallback dégradé automatique dans GalleryGrid
const MAVROS_GALLERY: GalleryItem[] = Array.from({ length: 9 }, (_, i) => ({
  src: '',
  label: `Réalisation ${i + 1}`,
}))

export const ARTISTS: Record<ArtistSlug, Artist> = {
  majic: {
    slug: 'majic',
    name: 'MAJIC',
    role: 'Graffeur & muraliste',
    tagline: 'La couleur comme langage',
    bio: [
      "Majic est l'une des deux moitiés du MaTwo Crew. Nourri par les imaginaires des grandes villes autant que par les territoires ruraux où il a vécu et voyagé, il déploie un art urbain haut en couleurs — fresques murales, décors immersifs et personnages qui font vibrer chaque surface.",
      "Son regard reste sensible au vivant, aux paysages, à la faune et à la flore, tout en gardant les deux pieds ancrés dans la pop culture et le graffiti.",
    ],
    instagram: 'https://www.instagram.com/majiccolors',
    instagramHandle: '@majiccolors',
    accent: '#00d4ff', // spray.cyan
    accentSoft: '#00d4ff',
    gallery: MAJIC_GALLERY,
  },
  mavros: {
    slug: 'mavros',
    // TODO: contenu réel après RDV
    name: 'MAVROS',
    role: 'Graffeur & muraliste',
    tagline: 'Le trait qui prend vie',
    bio: [
      "Mavros forme avec Majic le duo du MaTwo Crew. [Bio provisoire — à compléter avec l'artiste.] Issu de la culture street art, il puise dans les imaginaires urbains et ruraux pour composer des univers singuliers.",
      "[Placeholder] Sa signature mêle faune, flore et paysages à l'énergie brute du graffiti et aux clins d'œil de la pop culture.",
    ],
    instagram: '#',
    instagramHandle: '@mavros',
    accent: '#b44fff', // spray.purple
    accentSoft: '#ff2d78', // spray.pink
    gallery: MAVROS_GALLERY,
  },
}

export const ARTIST_LIST: Artist[] = [ARTISTS.majic, ARTISTS.mavros]
