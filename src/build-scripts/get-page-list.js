import path from 'path'
import { readFile } from 'fs/promises'
import fm from 'front-matter'

/**
 * Take the entryPoint and the outdir and derive the outputPath and the url.
 * Also, get the frontmatter data. Doing this before bundling, all pages are
 * rendered where each page has access to all page data.
 *
 * When frontmatter.navigation.url is present this will override the page.url
 */
export const getPageList = async ({ entryPoints, stripFromOutputPath, outdir }) => {
  const pageList = []

  for (const entryPoint of entryPoints) {
    const page = { entryPoint }
    const entryPointContent = await readFile(entryPoint, 'utf8')
    const frontMatterObj = fm(entryPointContent)

    page.frontmatter = frontMatterObj.attributes
    const { dir, name, ext } = path.parse(entryPoint)

    page.ext = ext
    const strippedDir = dir.replace(stripFromOutputPath, '')

    page.outputDir = path.join(outdir, strippedDir, name)
    page.url = page.outputDir.replace(outdir, '')
    page.outputPath = path.join(outdir, strippedDir, name, 'index.html')
    let url = page.frontmatter.navigation?.url

    if (url) {
      if (url[0] !== '/') {
        url = `/${url}`
      }

      // Override outputDir and outputPath when navigation.url is set
      page.outputDir = path.join(outdir, url)
      page.outputPath = path.join(outdir, url, 'index.html')
      page.url = url
    } else if (name === 'index') {

      // Override outputDir and outputPath for the root index
      page.outputDir = outdir
      page.outputPath = `${outdir}/index.html`
      page.url = '/'
    }
    pageList.push(page)
  }
  return pageList
}
