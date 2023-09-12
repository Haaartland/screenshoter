const puppeteer = require('puppeteer')
require('dotenv').config()
const screenShoter = async (req, res) => {
  const { adId, type, baseUrl } = req.body
  let browser = null

  let base64 = ''

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--disable-setuid-sandbox',
        '--no-sandbox',
        // '--single-process',
        '--no-zygote',
      ],
      executablePath:
        process.env.NODE_ENV === 'production'
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 1440, height: 1080, deviceScaleFactor: 2 })

    await page.goto(`${baseUrl}/deals/banners/${adId}?type=${type}`)

    // const readMoreBtn = await page.waitForSelector('.btn-read-more')
    // await readMoreBtn.evaluate((el) => el.remove())

    const element = await page.$(`.ad--${type}`)

    base64 = await element.screenshot({ encoding: 'base64' })
  } catch (err) {
    console.error(`❌ Error: ${err.message}`)
    res.send(`Something went wrong: ${err}`)
  } finally {
    await browser.close()
    console.log(`\n🎉 Screenshot captured.`)
  }

  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ base64 }))
}

module.exports = screenShoter
