import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// Compresses every image under src/assets/img/ as part of `vite build` —
// source files are never touched, only the copies written to dist/. Add a
// new image the same way as always; it gets optimized automatically on the
// next build, no manual step required. Doesn't touch video files (mp4) —
// those still need manual compression (e.g. ffmpeg) before committing.
const imageOptimizerConfig = {
  jpg: { quality: 75 },
  jpeg: { quality: 75 },
  png: { quality: 75 },
  webp: { lossless: false, quality: 75 },
  svg: {
    multipass: true,
  },
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), ViteImageOptimizer(imageOptimizerConfig)],
})