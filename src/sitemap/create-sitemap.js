import xml from 'xml'
import fs from 'fs/promises'
import path from 'path'

export const createSitemap = async ({ baseUrl, pages, sitemapPath }) => {
  const urls = []

  for (const page of pages) {
    const urlChildren = []

    if (page.frontmatter?.sitemap_exclude) {
      continue
    }

    if (page.url) {
      urlChildren.push({ loc: baseUrl + (page.url === '/' ? '' : page.url) })
    }
    const lastmodString = page.frontmatter?.lastmod || page.frontmatter?.date

    if (lastmodString) {
      const lastmodMsec = Date.parse(lastmodString)

      if (!isNaN(lastmodMsec)) {
        const lastmodDate = new Date(lastmodMsec)
        const lastmod = lastmodDate.toISOString()

        urlChildren.push({ lastmod })
      }
    }
    if (urlChildren.length > 0) {
      urls.push({ url: urlChildren })
    }
  }
  console.log(`Adding ${urls.length} pages to sitemap`)

  const xmlOptions = { declaration: true }
  const xmlData = { urlset: [{ _attr: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' } }, ...urls] }

  const xmlString = xml(xmlData, xmlOptions)
  const { dir } = path.parse(sitemapPath)

  await fs.mkdir(path.resolve(dir), { recursive: true })
  await fs.writeFile(sitemapPath || 'sitemap.xml', xmlString)
}
