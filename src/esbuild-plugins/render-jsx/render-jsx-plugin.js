import { writeFile, mkdir, rm } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import assert from 'node:assert'
import { render } from 'preact-render-to-string'
import { minify } from 'html-minifier'
import { logger } from '../../build-scripts/logger.js'

const pluginName = 'renderJsxPlugin'

/**
 * This plugin loops through all bundled files. These must be all .js files.
 * Other extensions should be handled with the 'file' loader. All bundles are
 * rendered to html. The default export function from the bundle is called with
 * options.initialProps and a page object.
 */
export const renderJsxPlugin = ({
  initialProps,
  removeBundle,
}) => {
  const setup = build => {
    build.onEnd(async result => {
      assert.strictEqual(build.initialOptions.bundle, true, 'Assert failed: bundle option must be true')
      assert.strictEqual(build.initialOptions.format, 'esm', 'Assert failed: format option must be esm')
      assert.strictEqual(build.initialOptions.metafile, true, 'Assert failed: metafile option must be true')
      assert.strictEqual(build.initialOptions.write, true, 'Assert failed: write option must be true')

      const metafileOutputs = Object.keys(result.metafile.outputs)

      for (const bundlePath of metafileOutputs) {
        const entryPoint = result.metafile.outputs[bundlePath].entryPoint

        if (!entryPoint) {
          continue
        }
        const pages = initialProps?.pages || []
        const page = (pages.find(p => p.entryPoint === entryPoint)) || {}

        page.bundlePath = bundlePath

        const cacheBust = crypto.randomBytes(6).toString('hex')
        const modulePath = path.resolve(`./${bundlePath}?v=${cacheBust}`)
        const module = await import(modulePath)
        let html = `<p>No default export in: ${bundlePath}</p>`

        logger.log(`${pluginName}: ${page.outputPath}`)

        // Check if the default export is a function
        if (typeof module?.default === 'function') {

          // Render the JSX component with props
          const props = Object.assign(initialProps, { page })

          html = render(module.default(props))
        } else {
          logger.error(`No default export in: ${bundlePath}`)
        }

        const minifiedHtml = minify(html, {
          minifyCSS: true,
          minifyJS: true,
          removeComments: true,
        })

        await mkdir(path.resolve(page.outputDir), { recursive: true })
        await writeFile(path.resolve(page.outputPath), `<!DOCTYPE html>${minifiedHtml}`)
        if (removeBundle) {
          await rm(page.bundlePath)
        }
      }
    })
  }

  return { name: pluginName, setup }
}
