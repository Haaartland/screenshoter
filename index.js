const express = require('express')
var cors = require('cors')
const screenShoter = require('./screenShoter')

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Puppeteer')
})

app.post('/screenshoter', (req, res) => {
  screenShoter(req, res)
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
