const Koa = require('koa')
const serve = require('koa-static')
const path = require('path')
const fs = require('fs-extra')
const session = require('koa-session')
const koaBody = require('koa-body')
const klaw = require('klaw')
const handlebars = require('handlebars')

const config = require('./package.json').config
const registerHelpers = require('./lib/hbs-helpers')
const transform = require('./middleware/transform')
const flash = require('./middleware/flash')
const errorHandler = require('./middleware/errorHandler')
const publicRoutes = require('./routes/publicRoutes')
const memberRoutes = require('./routes/memberRoutes')
const app = new Koa()

global.isDev = process.env.NODE_ENV === 'dev'
global.render = require('./lib/render')
global.templates = []

app.use(session({
  key: 'koa:sess',
  signed: false,
  maxAge: 86400000,
  httpOnly: false
}, app))

app.use(serve(path.join(__dirname, '/public')))
app.use(koaBody({
  multipart: true,
  patchNode: true,
  patchKoa: true
}))

app.use(errorHandler)
app.use(transform)
app.use(publicRoutes.routes())
app.use(publicRoutes.allowedMethods())
app.use(memberRoutes.routes())
app.use(memberRoutes.allowedMethods())
app.use(flash)

registerHelpers()

klaw(path.resolve(__dirname, '.', 'templates'))
.on('error', (err, item) => console.error(err.message))
.on('data', async file => {
  // register partials
  if (/\.hbs/.test(file.path) && /partial/.test(file.path)) {
    let splittedPath = file.path.split('/')
    let partialName = splittedPath[splittedPath.length-1].split('.hbs')[0]
    handlebars.registerPartial(partialName, fs.readFileSync(file.path, 'utf8').toString())
  }
})
.on('end', async () => {
  console.log(`App started on port: ${config.port};`)
  app.listen(config.port)
})

process.on('unhandledRejection', (reason, err) => {
  console.error(reason, err)
  app.context.logger.error('Error', {
    error: 'JS - promise rejection',
    reason: reason.toString()
  })
})
