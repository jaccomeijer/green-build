import { build } from 'esbuild'
import { readFile, rm } from 'fs/promises'
import path from 'path'

/**
 * This plugin processes *.bundle.css files. All imports and url references are
 * bundled into a temp file. The content of the temp bundle is returned for the
 * file loader to handle and the temp bundle is remove.
 */
export const bundleCssPlugin = {
  name: 'bundleCssPlugin',
  setup(buildArg) {
    buildArg.onLoad({ filter: /\.bundle\.css$/u }, async args => {
      const parsedInputPath = path.parse(args.path)
      const result = await build({
        bundle: true,
        assetNames: 'assets/[name]-[hash]',
        entryNames: 'assets/[name]-[hash]',
        entryPoints: [args.path],
        loader: {
          '.ttf': 'file',
        },
        metafile: true,
        outdir: buildArg.initialOptions.outdir,
      })

      // Lookup the output that matches the input filename
      let matchingOutput

      Object.keys(result.metafile.outputs).forEach(outputPath => {
        const output = result.metafile.outputs[outputPath]
        const parsedOutputPath = path.parse(output.entryPoint || '')

        if (parsedInputPath.base === parsedOutputPath.base) {
          matchingOutput = outputPath
        }
      })
      const contents = await readFile(matchingOutput)

      await rm(matchingOutput)
      return { loader: 'file', contents }
    })
  },
}
