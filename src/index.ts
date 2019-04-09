import 'perish'

import path from 'path'
import puppeteer from 'puppeteer'

const outDir = path.resolve(__dirname, '../images');

const main = async (packages: string[]) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage();

  await page.setViewport({
    height: 1024,
    width: 1024
  })

  for (const pkg of packages) {
    console.log(pkg)
    await page.goto(`https://www.npmjs.com/package/${pkg}`)
    const el = await page.$('#top > .order-0 > div:first-of-type')

    if (!el) {
      throw new Error(`Couldn't find statistics for ${pkg}`)
    }

    await el.screenshot({
      path: path.join(outDir, `${pkg}.png`)
    })
  }

  await browser.close()
}

main([])
