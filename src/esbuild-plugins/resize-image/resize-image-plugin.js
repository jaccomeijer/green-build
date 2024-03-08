import path from 'path'
import { resizeImage } from './resize-image.js'

const pluginName = 'resizeImagePlugin'

/**
 * This plugin loops through all bundled files. When a file has the jpg or the
 * png extension the plugin creates a copy of the image in webp format. For each
 * size in the options.sizes object an image is created. The original path is
 * returned from the import. This path (e.g. path/file.jpg) can be used to
 * create a srcset (path/file-m.webp, path/file-l.webp, etc). 'm' and 'l' in
 * this example are keys from the sizes object. See picture-ssr.jsx.
 */
export const resizeImagePlugin = options => {
  const setup = build => {
    const cache = new Map()

    build.onEnd(async result => {
      const outputPaths = Object.keys(result.metafile.outputs)

      for (const bundlePath of outputPaths) {
        const { ext } = path.parse(bundlePath)

        if (['.jpg', '.png'].includes(ext)) {

          // Resize a file only once
          if (cache.get(bundlePath)) {
            continue
          }
          console.log(`${pluginName}: ${bundlePath}`)
          await resizeImage({ inputPath: bundlePath, sizes: options.sizes })
          cache.set(bundlePath, true)
        }
      }
    })
  }

  return { name: pluginName, setup }
}
