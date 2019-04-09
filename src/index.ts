import debug from 'debug'
import path from 'path'
import puppeteer from 'puppeteer'

const log = debug('get-npm-stats')

export interface GetNpmStatsOptions {
  outDir: string
  packages: string[]
}

export const getNpmStats = async ({
  outDir,
  packages
}: GetNpmStatsOptions) => {
  log('Launching browser')
  const browser = await puppeteer.launch()
  const page = await browser.newPage();

  await page.setViewport({
    height: 1024,
    width: 1024
  })

  for (const pkg of packages) {
    log(`Fetching ${pkg}`)
    await page.goto(`https://www.npmjs.com/package/${pkg}`)
    const el = await page.$('#top > .order-0 > div:first-of-type')

    if (!el) {
      throw new Error(`Couldn't find statistics for ${pkg}`)
    }

    await el.screenshot({
      path: path.join(outDir, `${pkg}.png`)
    })
  }

  log('Closing browser')
  await browser.close()
}
