const puppeteer = require('puppeteer')
require('dotenv').config()

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const screenShoter = async (req, res) => {
  const { adId, type, baseUrl, styles } = req.body

  let browser = null

  let base64 = ''

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu',
      ],
      executablePath:
        process.env.NODE_ENV === 'production'
          ? process.env.PUPPETEER_EXECUTABLE_PATH
          : puppeteer.executablePath(),
    })

    const page = await browser.newPage()

    await page.setViewport({ width: 728, height: 1200, deviceScaleFactor: 2 })

    const stylesParams = new URLSearchParams(styles)

    const url = `${baseUrl}/deals/banners/${adId}?type=${type}&${stylesParams}`

    await page.goto(url, {
      waitUntil: 'domcontentloaded',
    })

    const element = await page.waitForSelector(`.ad--${type}`)

    await sleep(2000)

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
