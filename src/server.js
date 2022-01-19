const { createServer } = require('https')
const { Url } = require('url')
const next = require('next')
const fs = require('fs')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost-key.pem'),
  cert: fs.readFileSync('./certificates/localhost.pem')
}
app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = new Url().parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Server started on https://localhost:3000')
  })
})
