import glob from 'tiny-glob'

import { bundleMdx } from './bundle-mdx.js'
import { getPageList } from './get-page-list.js'

export const build = async config => {

  // Config defaults
  const entryPointsGlob = config.entryPointsGlob || 'src/pages/**/*.{mdx}'
  const outdir = config.outdir || 'dist'
  const imageSizes = config.imageSizes || {
    s: 300,
    m: 700,
    l: 1000,
  }
  const stripFromOutputPath = config.stripFromOutputPath || 'src/pages'
  const serve = config.serve || false
  const metadata = config.metadata || {}

  const entryPoints = await glob(entryPointsGlob)

  const pages = await getPageList({
    stripFromOutputPath,
    entryPoints,
    outdir,
  })

  const initialProps = {
    imageSizes,
    pages,
    metadata,
  }

  const ctx = await bundleMdx({
    stripFromOutputPath,
    entryPoints,
    initialProps,
    outdir,
    removeBundle: config.removeBundle,
  })

  if (serve) {
    await ctx.watch()
    const { port } = await ctx.serve({
      servedir: outdir,
    })

    console.log(`Live reload server started at http://localhost:${port}\n`)
  } else {
    await ctx.rebuild()
    ctx.dispose()
  }
}
