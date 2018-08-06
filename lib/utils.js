module.exports = {
  setUserSession: (ctx, params) => {
    ctx.session.user = params
  },
  hasSession: async function(ctx, next) {
    if (ctx.session.user) {
      return ctx.redirect('/member')
    }
    await next()
  }
}