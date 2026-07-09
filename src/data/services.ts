import { Brush, Palette, PartyPopper, type LucideIcon } from 'lucide-react'

export interface Service {
  icon: LucideIcon
  title: string
  desc: string
  tag: string
}

export const SERVICES: Service[] = [
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

export const CREW = {
  name: 'MATWO CREW',
  instagram: 'https://www.instagram.com/majiccolors',
  instagramHandle: '@majiccolors',
  zone: 'Pyrénées-Atlantiques',
  // TODO: '/videos/crew.mp4' quand la vidéo du duo sera prête
  video: '',
}
