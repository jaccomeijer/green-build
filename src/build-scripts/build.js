import glob from 'tiny-glob'

import { bundleMdx } from './bundle-mdx.js'
import { getPageList } from './get-page-list.js'

const IMAGE_SIZES = {
  s: 300,
  m: 700,
  l: 1000,
}

const assertKeyValue = ({ obj, key, defaultValue }) => {
  if (!obj[key]) {
    obj[key] = defaultValue
  }
}

export const build = async config => {
  assertKeyValue({ obj: config, key: 'entryPointsGlob', defaultValue: 'src/pages/**/*.{mdx}' })
  assertKeyValue({ obj: config, key: 'initialProps', defaultValue: {} })
  assertKeyValue({ obj: config, key: 'outdir', defaultValue: 'dist' })
  assertKeyValue({ obj: config, key: 'removeBundle', defaultValue: false })
  assertKeyValue({ obj: config, key: 'serve', defaultValue: false })
  assertKeyValue({ obj: config, key: 'stripFromOutputPath', defaultValue: 'src/pages' })

  assertKeyValue({ obj: config.initialProps, key: 'assetUrlPrefix', defaultValue: '' })
  assertKeyValue({ obj: config.initialProps, key: 'imageSizes', defaultValue: IMAGE_SIZES })
  assertKeyValue({ obj: config.initialProps, key: 'metadata', defaultValue: {} })

  const entryPoints = await glob(config.entryPointsGlob)

  config.initialProps.pages = await getPageList({
    stripFromOutputPath: config.stripFromOutputPath,
    entryPoints,
    outdir: config.outdir,
  })

  const bundleConfig = {
    entryPoints,
    initialProps: config.initialProps,
    outdir: config.outdir,
    removeBundle: config.removeBundle,
    stripFromOutputPath: config.stripFromOutputPath,
  }

  const ctx = await bundleMdx(bundleConfig)

  if (config.serve) {
    await ctx.watch()
    const { port } = await ctx.serve({
      servedir: config.outdir,
    })

    console.log(`Live reload server started at http://localhost:${port}\n`)
  } else {
    await ctx.rebuild()
    ctx.dispose()
  }
}
