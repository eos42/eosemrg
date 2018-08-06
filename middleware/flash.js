module.exports = async (ctx, next) => {
  if (ctx.session.flash) {
    ctx.session.flash = null
  }
  next()
}
