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
  entryPoints,
  imageSizes,
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
    loader: {

      // Importing these files in js returns a filename with hash
      '.ce.js': 'file',
      '.ce.css': 'file',
      '.ico': 'file',
      '.jpg': 'file',
      '.png': 'file',
      '.svg': 'file',
    },
    metafile: true,
    outdir,
    packages: 'external',
    platform: 'node',
    plugins: [
      mdx({
        remarkPlugins: [
          [remarkGfm],
          [remarkFrontmatter, ['yaml', 'toml']],
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [rehypeHighlight],
      }),
      renderJsxPlugin({
        initialProps,
        removeBundle,
      }),
      bundleCssPlugin,
      resizeImagePlugin({ sizes: imageSizes }),
    ],
    write: true,
  })

  return ctx
}
