import { bundleCssPlugin } from '../esbuild-plugins/bundle-css/bundle-css-plugin.js'
import { renderJsxPlugin } from '../esbuild-plugins/render-jsx/render-jsx-plugin.js'
import { resizeImagePlugin } from '../esbuild-plugins/resize-image/resize-image-plugin.js'
import { context } from 'esbuild'
import mdx from '@mdx-js/esbuild'
import rehypeHighlight from 'rehype-highlight'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'

export const bundleMdx = async ({
  stripFromOutputPath,
  entryPoints,
  initialProps,
  outdir,
  removeBundle,
}) => {
  const ctx = await context({
    bundle: true,
    entryNames: 'assets/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    entryPoints,
    format: 'esm',
    jsx: 'automatic',
    jsxImportSource: 'preact',
    loader: {

      // Importing these files in js returns a filename with hash
      '.ce.js': 'file',
      '.css': 'file',
      '.ico': 'file',
      '.jpg': 'file',
      '.svg': 'file',
    },
    metafile: true,
    outdir,
    platform: 'node',
    plugins: [
      mdx({
        jsxImportSource: 'preact',
        remarkPlugins: [
          [remarkGfm],
          [remarkFrontmatter, ['yaml', 'toml']],
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [rehypeHighlight],
      }),
      renderJsxPlugin({
        stripFromOutputPath,
        initialProps,
        outdir,
        removeBundle,
      }),
      bundleCssPlugin,
      resizeImagePlugin({ sizes: initialProps.imageSizes }),
    ],
    write: true,
  })

  return ctx
}
