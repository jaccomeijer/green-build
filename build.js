import { build } from 'esbuild'

await build({
  bundle: true,
  entryPoints: ['./src/index.js'],
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  outdir: 'dist',
  platform: 'node',
})
