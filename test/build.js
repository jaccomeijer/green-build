import { build } from '../dist/index.js'

const config = {
  entryPointsGlob: 'test/**/*.{mdx}',
  imageSizes: {
    s: 300,
    m: 700,
    l: 1000,
  },
  outdir: 'dist',
  removeBundle: true,
  serve: true,
  stripFromOutputPath: 'test',
}

build(config)
