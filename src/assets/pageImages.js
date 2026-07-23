import heroBg from './img/oficials/image00029.jpeg'
import studioBg from './img/oficials/image00070.jpeg'
import consoleBg from './img/oficials/image00119.jpeg'
import teamDiego from './img/oficials/image00107.jpeg'
import teamJose from './img/samples/JoseMusalem.jpg'
import teamPablo from './img/oficials/image00131.jpeg'
import podcastAudio from './img/samples/podcast.jpg'
import podcastVideo from './img/oficials/image00144.jpeg'
import podcastReels from './img/oficials/image00005.jpeg'
import avPodcast from './img/puntiagudo1/P1_3.jpg'
import avVideo from './img/diam1/D1_4.jpg'
import avReels from './img/puntiagudo2/P2_5.jpg'
import avSampleLoop from './videos/teburu sample.mp4'

export const pageImages = {
  nosotrosHero: consoleBg,
  contactoBg: studioBg,
  portafolioHero: heroBg,
  team: {
    diego: teamDiego,
    jose: teamJose,
    pablo: teamPablo,
  },
  podcast: {
    audio: podcastAudio,
    video: podcastVideo,
    reels: podcastReels,
  },
  audiovisual: {
    podcast: avPodcast,
    videoPodcast: avVideo,
    reels: avReels,
  },
  // Loops de video para las cards de "audiovisual" en Portafolio.
  // Reemplazá cada entrada por el clip final cuando esté listo (mismo import,
  // solo cambiá la ruta) — por ahora las 3 usan el mismo sample de prueba.
  audiovisualVideo: {
    podcast: avSampleLoop,
    videoPodcast: avSampleLoop,
    reels: avSampleLoop,
  },
}
