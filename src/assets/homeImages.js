/**
 * Official photos mapped to former sample slots by aspect ratio:
 * - landscape (~3:2): image00029, image00070
 * - portrait (2:3): remaining oficials
 */

import heroBg from './img/oficials/image00029.jpeg'
import landscapeBg from './img/oficials/image00070.jpeg'

import portrait05 from './img/oficials/image00005.jpeg'
import portrait19 from './img/oficials/image00119.jpeg'
import portrait31 from './img/oficials/image00131.jpeg'
import portrait44 from './img/oficials/image00144.jpeg'

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
  services: [landscapeBg, portrait31, portrait05],
  studioGallery: [landscapeBg, portrait19, portrait44],
}
