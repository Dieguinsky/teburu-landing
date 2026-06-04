/**
 * Official photos mapped to former sample slots by aspect ratio:
 * - landscape (~3:2): image00029, image00070
 * - portrait (2:3): remaining oficials
 */

import heroBg from './img/oficials/image00029.jpeg'
import landscapeBg from './img/oficials/image00070.jpeg'

import portrait04 from './img/oficials/image00004.jpeg'
import portrait05 from './img/oficials/image00005.jpeg'
import portrait07 from './img/oficials/image00107.jpeg'
import portrait19 from './img/oficials/image00119.jpeg'
import portrait23 from './img/oficials/image00123.jpeg'
import portrait31 from './img/oficials/image00131.jpeg'
import portrait44 from './img/oficials/image00144.jpeg'

export const homeImages = {
  hero: heroBg,
  welcomeBg: landscapeBg,
  artistsBg: landscapeBg,
  services: [landscapeBg, portrait04, portrait31, portrait05],
  studioGallery: [landscapeBg, portrait19, portrait44],
  team: [portrait04, portrait07, portrait23],
}
