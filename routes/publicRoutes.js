const Router = require('koa-router')
const bcrypt = require('bcrypt')
const { setUserSession } = require('../lib/utils')
const db = require('../lib/db')
const UserModel = require('../models/UserModel')
const r = Router()


r.get('/', hasSession, async (ctx) => {
  let props = {...ctx.props}
  ctx.body = render('page-public', props)
})

r.post('/login', hasSession, async (ctx) => {
  let props = {...ctx.props}

  if (props.body.username && props.body.password) {
    let isPasswordCorrect
    let user = (await db.findOne(UserModel, {
      username: props.body.username
    })).result

    if (!user) {
      props.session.flash = 'Wrong username or password'
      return ctx.redirect('/')
    } else {
      isPasswordCorrect = bcrypt.compareSync(props.body.password, user.password)
    }

    if (!isPasswordCorrect) {
      props.session.flash = 'Wrong username or password'
      return ctx.redirect('/')
    }

    setUserSession(ctx, { username: props.body.username })
    return ctx.redirect('/member')
  }

})

r.get('/logout', async (ctx) => {
  ctx.session = null
  ctx.redirect('/')
})


r.get('/add-user', async (ctx) => {
  let props = {...ctx.props}
  ctx.body = render('page-public', props)
})

r.post('/save-user', async (ctx) => {
  let props = {...ctx.props}

  if (props.body.username && props.body.password) {
    let hash = bcrypt.hashSync(props.body.password, 10)
    let saved = (await db.save(UserModel, {
      username: props.body.username,
      password: hash
    })).result
    if (saved.errmsg) {
      console.log(saved.code)
      props.session.flash = {
        newUserError: saved.code === 11000 ? 'User already exists' : null || saved.errmsg
      }
    } else {
      props.session.flash = {
        newUserOk: "New user was added"
      }
    }
  }

  ctx.redirect('/add-user')
})


async function hasSession(ctx, next) {
  if (ctx.session.user) {
    return ctx.redirect('/member')
  }
  await next()
}


module.exports = r