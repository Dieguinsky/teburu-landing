import heroBg from './img/oficials/image00029.jpeg'
import landscapeBg from './img/oficials/image00070.jpeg'

import studioEscritorioFrente from './img/Espacio/escritorio-frente.jpg'
import studioSofa from './img/Espacio/sofa.jpg'
import studioWa8000 from './img/Espacio/wa8000.jpg'
import servicesMusica from './img/Espacio/apollo.jpg'
import servicesPodcast from './img/podcast/Imagen Podcast 1.jpg'
import servicesAudiovisual from './img/oficials/image00109.jpeg'
import servicesMusicaLoop from './videos/cqs-loop.mp4'
import servicesPodcastLoop from './videos/video-podcast-loop.mp4'
import servicesAudiovisualLoop from './videos/services-audiovisual-loop.mp4'

const albumCoverModules = import.meta.glob('./img/caratulas/*.jpg', {
  eager: true,
  import: 'default',
})

export const albumCovers = Object.entries(albumCoverModules).map(([path, src]) => ({
  key: path,
  title: path.split('/').pop().replace(/\.jpg$/i, '').replace(/^\d+\.\s*/, ''),
  src,
}))

export const homeImages = {
  hero: heroBg,
  welcomeBg: landscapeBg,
  artistsBg: landscapeBg,
  services: [servicesMusica, servicesPodcast, servicesAudiovisual],
  // Loops de video para las cards de "Servicios Disponibles" en Home — Música
  // y Podcast usan footage real de sesiones Teburu (loops distintos entre sí),
  // Audiovisual usa el timelapse de montaje.
  servicesVideo: [servicesMusicaLoop, servicesPodcastLoop, servicesAudiovisualLoop],
  studioGallery: [studioEscritorioFrente, studioSofa, studioWa8000],
}
