import { describe, it, mock } from 'node:test'
import { createSitemap } from './create-sitemap.js'
import assert from 'node:assert'
import { pages } from './fixtures/pages.js'
import fs from 'fs/promises'

describe('sitemap', () => {
  mock.method(fs, 'writeFile', async () => 'dummy-content')

  it('should write a sitemap', async () => {
    const expectedSiteMap = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://base/url/blog/render-jsx-plugin</loc><lastmod>2024-03-24T00:00:00.000Z</lastmod></url><url><loc>https://base/url/blog/ui-library</loc><lastmod>2024-03-21T00:00:00.000Z</lastmod></url><url><loc>https://base/url/blog/blog</loc><lastmod>2024-03-22T00:00:00.000Z</lastmod></url><url><loc>https://base/url</loc></url></urlset>'

    await createSitemap({ baseUrl: 'https://base/url', pages })

    assert.deepStrictEqual(await fs.writeFile.mock.calls.length, 1)
    assert.deepStrictEqual(await fs.writeFile.mock.calls[0].arguments.length, 2)
    assert.deepStrictEqual(await fs.writeFile.mock.calls[0].arguments[0], 'sitemap.xml')
    assert.deepStrictEqual(await fs.writeFile.mock.calls[0].arguments[1], expectedSiteMap)
  })
})
