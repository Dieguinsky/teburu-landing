import heroBg from './img/oficials/image00029.jpeg'
import studioBg from './img/oficials/image00070.jpeg'
import consoleBg from './img/oficials/image00119.jpeg'
import teamDiego from './img/oficials/image00107.jpeg'
import teamJose from './img/equipo/josemusalem.jpg'
import teamPablo from './img/oficials/image00131.jpeg'
import avPodcast from './img/portafolio/iribarne-live-poster.jpg'
import avVideo from './img/diam1/D1_4.jpg'
import avReels from './img/puntiagudo2/P2_5.jpg'
import avSampleLoop from './videos/teburu sample.mp4'
import avPodcastLoop from './videos/iribarne-live-loop.mp4'
import reelTeburu1 from './img/portafolio/reels/DXpw2qxkfxB.jpg'
import reelTeburu2 from './img/portafolio/reels/DPe9LDWDG5z.jpg'
import reelMisfitzpower from './img/portafolio/reels/DOrhSCBCRO9.jpg'
import reelDelorean1 from './img/portafolio/reels/DVekggIlKeL.jpg'
import reelDelorean2 from './img/portafolio/reels/DVRu1k0lKU9.jpg'
import reelCarrete1 from './img/portafolio/reels/DYiMpXVNQvQ.jpg'
import reelCarrete2 from './img/portafolio/reels/DUG8ZxjlSfQ.jpg'
import reelCarrete3 from './img/portafolio/reels/DUB34eDFcWP.jpg'
import reelCarrete4 from './img/portafolio/reels/DZLzQsYtL0r.jpg'
import reelAndes1 from './img/portafolio/reels/Dbg6vvZRjXU.jpg'
import reelAndes2 from './img/portafolio/reels/Dbb4TEPxMxJ.jpg'
import reelAndes3 from './img/portafolio/reels/DbEKDRhJzEa.jpg'
import reelAndes4 from './img/portafolio/reels/DbCK8eNxcM3.jpg'
import reelAndes5 from './img/portafolio/reels/DatxJwgxs6u.jpg'
import reelAndesTouring from './img/portafolio/reels/DaoKRNeR4pd.jpg'
import estudioHero from './img/oficials/image00024.jpeg'
import estudioGalleryEscritorioFrente from './img/Espacio/escritorio-frente.jpg'
import estudioGalleryEscritorioArriba from './img/Espacio/escritorio-arriba.jpg'
import estudioGallerySofa from './img/Espacio/sofa.jpg'
import estudioGalleryWa8000 from './img/Espacio/wa8000.jpg'
import cotizadorPodcast from './img/podcast/Imagen Podcast 3.jpg'
import retroStar1 from './img/diam1/D1_1.jpg'
import retroStar2 from './img/diam2/D2_1.jpg'
import retroStar3 from './img/puntiagudo1/P1_1.jpg'
import retroStar4 from './img/puntiagudo2/P2_1.jpg'

export const pageImages = {
  nosotrosHero: consoleBg,
  contactoBg: studioBg,
  portafolioHero: heroBg,
  estudioHero,
  cotizadorPodcast,
  estudioGallery: [
    estudioGalleryEscritorioFrente,
    estudioGalleryEscritorioArriba,
    estudioGallerySofa,
    estudioGalleryWa8000,
  ],
  team: {
    diego: teamDiego,
    jose: teamJose,
    pablo: teamPablo,
  },
  audiovisual: {
    podcast: avPodcast,
    videoPodcast: avVideo,
    reels: avReels,
  },
  // Loops de video para las cards de "audiovisual" en Portafolio.
  // "podcast" ya usa un clip real (sesión en vivo grabada en Teburu);
  // reemplazá videoPodcast/reels por sus clips finales cuando estén listos
  // (mismo import, solo cambiá la ruta) — por ahora usan el sample de prueba.
  audiovisualVideo: {
    podcast: avPodcastLoop,
    videoPodcast: avSampleLoop,
    reels: avSampleLoop,
  },
  // Miniaturas (frame de portada de Instagram) de reels/video podcasts reales
  // producidos en Teburu, usadas en la grilla de "Trabajos" de Portafolio.
  reels: {
    teburu1: reelTeburu1,
    teburu2: reelTeburu2,
    misfitzpower: reelMisfitzpower,
    delorean1: reelDelorean1,
    delorean2: reelDelorean2,
    carrete1: reelCarrete1,
    carrete2: reelCarrete2,
    carrete3: reelCarrete3,
    carrete4: reelCarrete4,
    andes1: reelAndes1,
    andes2: reelAndes2,
    andes3: reelAndes3,
    andes4: reelAndes4,
    andes5: reelAndes5,
    andesTouring: reelAndesTouring,
  },
  // Teburu star-mark badges reused as floating "sticker" decoration for the
  // retro-mode easter egg (see components/RetroMode) — not real photos.
  retroStars: [retroStar1, retroStar2, retroStar3, retroStar4],
}
