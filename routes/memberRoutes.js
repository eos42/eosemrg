const Router = require('koa-router')
const bcrypt = require('bcrypt')
const db = require('../lib/db')
const UserModel = require('../models/UserModel')
const emergencySend = require('../lib/emergency-send')
const r = Router()

r.get('/member', hasSession, async (ctx) => {
  let props = {...ctx.props}
  ctx.body = render('page-member', props)
})

r.get('/member/add-user', hasSession, async (ctx) => {
  let props = {...ctx.props}
  ctx.body = render('page-member', props)
})

r.post('/member/save-user', hasSession, async (ctx) => {
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

  ctx.redirect('/member/add-user')
})

r.post('/member/send-sms', hasSession, async (ctx) => {
  let props = {...ctx.props}

  if (props.body.sending) {
    props.alertdedProducerNames = []
    let { activeProducers } = await emergencySend()
    let keys = Object.keys(activeProducers)
    for (let number of keys) {
      props.alertdedProducerNames.push(activeProducers[number])
    }
    props.session.flash = {
      sentResult: props.alertdedProducerNames
    }
  }

  ctx.redirect('/member')
})

module.exports = r


async function hasSession(ctx, next) {
  if (!ctx.session.user) {
    return ctx.redirect('/')
  }
  await next()
}