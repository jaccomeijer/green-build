import { build } from 'esbuild'

await build({
  bundle: true,
  entryPoints: ['./src/index.js'],
  format: 'esm',
  jsx: 'automatic',
  minify: true,
  outdir: 'dist',
  packages: 'external',
  platform: 'node',
})
