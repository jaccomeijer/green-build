import glob from 'tiny-glob'

import { bundleMdx } from './bundle-mdx.js'
import { getPageList } from './get-page-list.js'

const addKeyIfNotExists = ({ obj, key, defaultValue }) => {
  if (!obj[key]) {
    obj[key] = defaultValue
  }
}

export const build = async config => {

  // Config defaults
  const entryPointsGlob = config.entryPointsGlob || 'src/pages/**/*.{mdx}'
  const initialProps = config.initialProps || {}
  const outdir = config.outdir || 'dist'
  const serve = config.serve || false
  const stripFromOutputPath = config.stripFromOutputPath || 'src/pages'

  const defaultImageSizes = {
    s: 300,
    m: 700,
    l: 1000,
  }

  addKeyIfNotExists({ obj: initialProps, key: 'assetUrlPrefix', defaultValue: '' })
  addKeyIfNotExists({ obj: initialProps, key: 'imageSizes', defaultValue: defaultImageSizes })
  addKeyIfNotExists({ obj: initialProps, key: 'metadata', defaultValue: {} })

  const entryPoints = await glob(entryPointsGlob)

  initialProps.pages = await getPageList({
    stripFromOutputPath,
    entryPoints,
    outdir,
  })

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
